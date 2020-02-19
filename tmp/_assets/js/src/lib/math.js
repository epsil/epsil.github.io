import $ from 'jquery';

export function addFormulas() {
  return this.each(function() {
    $(this)
      .find('p')
      .filter(function() {
        const text = $(this).text() || '';
        return (
          (text.match(/^\$\$/) && text.match(/\$\$$/)) ||
          (text.match(/^\\\[/) && text.match(/\\]$/))
        );
      })
      .each(function() {
        $(this).addClass('formula');
      });
  });
}

export function addTeXLogos() {
  return this.map(function() {
    const body = $(this);
    // cf. http://edward.oconnor.cx/2007/08/tex-poshlet
    // and http://nitens.org/taraborelli/texlogo
    const a = '<span class="latex-a">a</span>';
    const la = 'L' + a;
    const e = '<span class="tex-e">e</span>';
    const tex = 'T' + e + 'X';
    const eps = '<span class="latex-epsilon">&#949;</span>';
    const sp = '<span class="latex-space">&nbsp;</span>';
    const twoe = '2' + eps;
    const ee = '<span class="xetex-e">&#398;</span>';
    const xe = 'X' + ee;
    body.find('abbr[title=XeTeX]').html(xe + tex);
    body.find('abbr[title=XeLaTeX]').html(xe + la + tex);
    body.find('abbr[title="LaTeX 2e"]').html(la + tex + sp + twoe);
    body.find('abbr[title=LaTeX]').html(la + tex);
    body.find('abbr[title=LuaTeX]').html('Lua' + tex);
    body.find('abbr[title=ConTeXt]').html('Con' + tex + 't');
    body.find('abbr[title=AUCTeX]').html('AUC' + tex);
    body.find('abbr[title=MusiXTeX]').html('MusiX' + tex);
    body.find('abbr[title=MiKTeX]').html('MiK' + tex);
    body.find('abbr[title=PCTeX]').html('PC' + tex);
    body.find('abbr[title=KaTeX]').html('K' + a + tex);
    body.find('abbr[title=MacTeX]').html('Mac' + tex);
    body.find('abbr[title=lhs2TeX]').html('lhs2' + tex);
    body.find('abbr[title=TeX]').html(tex);
    return body;
  });
}

if ($ && $.fn) {
  $.fn.addFormulas = addFormulas;
  $.fn.addTeXLogos = addTeXLogos;
}

export default {
  addFormulas,
  addTeXLogos
};
