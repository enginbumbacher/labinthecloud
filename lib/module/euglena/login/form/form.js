import Form from 'core/component/form/form';
import TextField from 'core/component/textfield/field';
import Button from 'core/component/button/field';
import Utils from 'core/util/utils';

export default class LoginForm extends Form {
  constructor(settings = {}) {
    super({
      modelData: {
        id: "login",
        classes: ["form__login"],
        title: "Sign In",
        fields: [TextField.create({
          id: "email",
          placeholder: "Group Name",
          changeEvents: 'change blur',
          //value: 'engin@gmail.com',
          validation: {
            exists: {
              errorMessage: "Correct group name address required"
            },
            custom: {
              errorMessage: "Not a valid login",
              fn: (val, spec) => {
                return new Promise((resolve, reject) => {
                  Utils.promiseAjax(`${window.location.pathname}/access`, {
                    method: 'POST',
                    data: { email: val }
                  }).then((res) => {
                    resolve(res.access);
                  }, (err) => {
                    resolve(false);
                  });
                });
              }
            }
            // email: {
            //   errorMessage: "Not a valid group name"
            // }
          }
        })],
        buttons: [Button.create({
          id: "submit",
          label: "Sign In",
          eventName: "Login.Submit"
        })]
      }
    })
  }
}
