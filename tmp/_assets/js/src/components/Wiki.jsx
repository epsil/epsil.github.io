import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import * as openpgp from 'openpgp';
import datatables from 'datatables';
import yaml from 'js-yaml';
import $ from 'jquery';
import Layout from './Layout';
import Prompt from './Prompt';
import LoadingScreen from './Load';
import {
  compileMarkdownInView,
  makeView,
  parseMetadataInView,
  processHtmlInView
} from '../lib/compile';
import { hashArgs, isLocalFile, pagePath } from '../lib/page';
import { refsPath, refsPathYaml } from '../lib/reference';
import { abbrPath, abbrPathYaml } from '../lib/abbrev';
import { mdPath, pgpPath } from '../lib/markdown';
import { unhideSection } from '../lib/collapse';
import { slugify } from '../lib/util';
import { removeIcon } from '../lib/util-dom';
import settings from '../../../yml/json/settings.json';

class Wiki extends Component {
  constructor(props) {
    super(props);
    this.update = true;
    this.state = settings;

    let { local } = this.state;
    local = local === undefined ? isLocalFile() : local;
    this.state.local = local;

    this.getResources = this.getResources.bind(this);
    this.getReferences = this.getReferences.bind(this);
    this.getAbbreviations = this.getAbbreviations.bind(this);
    this.getMarkdown = this.getMarkdown.bind(this);
    this.decrypt = this.decrypt.bind(this);
    this.compileMarkdown = this.compileMarkdown.bind(this);
    this.loadMarkdown = this.loadMarkdown.bind(this);
    this.addClickHandlers = this.addClickHandlers.bind(this);
    this.moveToHashOnLoad = this.moveToHashOnLoad.bind(this);
    this.moveToHash = this.moveToHash.bind(this);
    this.scrollToElement = this.scrollToElement.bind(this);
  }

  async componentDidMount() {
    const { markdown, references, abbreviations } = await this.getResources();
    this.setState({ references, abbreviations });
    await this.loadMarkdown(markdown);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.update;
  }

  async getResources() {
    this.setState({ status: 'download' });
    const [markdown, references, abbreviations] = await Promise.all([
      this.getMarkdown(),
      this.getReferences(),
      this.getAbbreviations()
    ]);
    return { markdown, references, abbreviations };
  }

  async getReferences() {
    const response = await fetch(refsPathYaml(), { cache: 'no-cache' });
    const yml = await response.text();
    const references = yaml.safeLoad(yml);
    return references;
  }

  async getAbbreviations() {
    const response = await fetch(abbrPathYaml(), { cache: 'no-cache' });
    const yml = await response.text();
    const abbreviations = yaml.safeLoad(yml);
    return abbreviations;
  }

  async getMarkdown() {
    let file = '';
    let response = null;
    try {
      file = mdPath(); // markdown
      response = await fetch(file, { cache: 'no-cache' });
      if (response.status >= 400) {
        throw new Error('Bad response from server');
      }
    } catch (err) {
      response = null;
      try {
        file = pgpPath(); // encrypted markdown
        response = await fetch(file, { cache: 'no-cache' });
        if (response.status >= 400) {
          throw new Error('Bad response from server');
        }
      } catch (err2) {
        response = null;
      }
    }
    if (!response) {
      return '';
    }
    this.setState({ file });
    const md = (await response.text()) || '';
    return md.trim();
  }

  async decrypt(pass) {
    const { ciphertext } = this.state;
    this.setState({ decrypted: false, disabledPrompt: true });
    try {
      const { data } = await openpgp.decrypt({
        message: await openpgp.message.readArmored(ciphertext), // parse armored message
        passwords: [pass], // decrypt with password
        format: 'utf8'
      });
      this.setState({
        decrypted: true,
        disabledPrompt: false,
        invalidPassword: false,
        prompt: false
      });
      await this.compileMarkdown(data);
    } catch (err) {
      this.setState({
        disabledPrompt: false,
        invalidPassword: true,
        decrypted: false
      });
    }
  }

  async compileMarkdown(md) {
    this.setState({ status: 'compile' });
    const { references, abbreviations } = this.state;
    let view = makeView(md, {
      references,
      abbreviations,
      path: pagePath()
    });
    view = parseMetadataInView(view);
    this.setState(view);
    view = compileMarkdownInView(view);
    this.setState({ ...view, status: 'html' });
    view = processHtmlInView(view);
    this.setState({ ...view, status: 'content' });
    this.setState(view);
    const viewHasIcon = view.icon || view['cover-image'] || view.image;
    if (viewHasIcon) {
      removeIcon();
    }
    this.update = false;
    this.addClickHandlers();
    this.moveToHashOnLoad();
  }

  async loadMarkdown(md) {
    const isEncryptedMessage = md.match(/^-+BEGIN PGP MESSAGE/);
    if (isEncryptedMessage) {
      this.setState({
        status: 'prompt',
        ciphertext: md.trim(),
        prompt: true
      });
    } else {
      await this.compileMarkdown(md);
    }
  }

  addClickHandlers() {
    $('body').addCollapsibleHandlers();
    $('body').addLinkHandlers();
    $('body').addFootnoteHandlers();
    $('table')
      .filter(function() {
        return $(this).find('thead th').length > 0;
      })
      .DataTable({
        bInfo: false,
        order: [],
        paging: false,
        searching: false
      });
  }

  // FIXME: this belongs in util.js
  moveToHashOnLoad(hash) {
    this.moveToHash(hash);
    $(() => {
      this.moveToHash(hash);
      const hasImages = $('article img').length > 0;
      const hasTables = $('article table').length > 0;
      const { stylesheet: hasStylesheet } = this.state;
      const hasDynamicElements = hasImages || hasTables || hasStylesheet;
      if (hasDynamicElements) {
        setTimeout(() => this.moveToHash(hash), 500);
      }
    });
  }

  moveToHash(hash) {
    let hashArg = hash || hashArgs(0);
    if (hashArg && hashArg !== '#') {
      const decodedHash = decodeURIComponent(hashArg);
      const latin1Hash = '#' + slugify(decodedHash);
      const hashContainsSpacesOrLargeLetters = hashArg !== latin1Hash;
      if (hashContainsSpacesOrLargeLetters) {
        hashArg = latin1Hash;
      }
      const target = $(hashArg).first();
      if (target.length) {
        unhideSection(target);
        this.scrollToElement(target);
      }
    }
  }

  scrollToElement(el, offset, time) {
    const offsetVal = offset || -50;
    const timeVal = time || 0;
    $(window).scrollTop(el.offset().top + offsetVal);
  }

  render() {
    const {
      prompt,
      invalidPassword,
      disabledPrompt,
      decrypted,
      markdown
    } = this.state;
    if (prompt) {
      return (
        <Prompt
          disabled={disabledPrompt}
          invalid={invalidPassword}
          submit={this.decrypt}
        />
      );
    }
    if (!markdown) {
      const { status } = this.state;
      return <LoadingScreen status={status} />;
    }
    return <Layout {...this.state} />;
  }
}

export default Wiki;
