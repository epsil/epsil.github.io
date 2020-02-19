import React from 'react';

const Prompt = props => {
  const { disabled, invalid, submit } = props;

  let input;
  const init = ref => {
    if (!input && ref) {
      input = ref;
      input.focus(); // use 'autofocus' attribute instead?
    }
    return input;
  };

  const handleSubmit = e => {
    e.preventDefault();
    submit(input.value);
  };

  // className="modal fade"
  return (
    <div id="passwordPrompt" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content text-center">
          <div className="modal-header">
            <h4 className="modal-title" title="Data is encrypted">
              {disabled ? (
                <i className="fa fa-unlock-alt" />
              ) : (
                <i className="fa fa-lock" />
              )}
              &nbsp;Protected data
            </h4>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="fa fa-key" title="Password" />
                  </div>
                  <input
                    className="form-control text-center"
                    disabled={disabled}
                    id="password"
                    placeholder="Password"
                    ref={init}
                    style={{ paddingRight: '4em' }}
                    title="Enter encryption key"
                    type="password"
                    required
                  />
                </div>
              </div>
              <button
                className="btn btn-block btn-primary"
                disabled={disabled}
                title="Unlock data"
                type="submit"
              >
                <i
                  className={
                    disabled ? 'fa fa-spinner fa-pulse fa-fw' : 'fa fa-sign-in'
                  }
                />
                &nbsp;{disabled ? 'Decrypting\u00a0\u2026' : 'Decrypt'}
              </button>
            </form>
          </div>
          {invalid && (
            <div className="modal-footer">
              <p className="small text-danger text-center">Invalid password</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Prompt;
