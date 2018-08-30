'use strict';

module.exports = function(LabUser) {
  LabUser.on('resetPasswordRequest', (info) => {
    let url = `${info.options.baseUrl}admin/reset-password?access_token=${info.accessToken.id}`;
    let message = `<h2>Password Reset</h2>
<div>Reset your password by clicking this link: <a href="${ url }">${ url }</a> to reset your password.</div>
<p>--<br/>The Lab in the Cloud team</p>`;
    LabUser.app.models.Email.send({
      to: info.email,
      from: process.env.SCRIPT_EMAIL_ADDRESS,
      subject: "Lab in the Cloud - Password Reset",
      html: message
    }, (err) => {
      if (err) return console.log("Error sending password reset email");
      console.log("Password reset email sent to ", info.email)
    })
  })
};
