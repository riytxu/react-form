import { FC, useState, useRef, MutableRefObject } from "react";
import { Formik, Form, Field } from "formik";
import { FormikHelpers } from "formik";
import * as Yup from "yup";
import cn from "classnames";
import MaskedInput from "react-text-mask";

import { Loader } from "./components/Loader/Loader";
import { IForm } from "./types";

import "./App.css";

export const App: FC<{}> = () => {
  const [users, setUsers] = useState<IForm[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const controller = useRef() as MutableRefObject<AbortController>;

  const initialValues: IForm = {
    email: "",
    number: "",
  };

  const getUsers = (values: IForm) => {
    setLoading(true);
    fetch("http://localhost:5000/search", {
      method: "POST",
      headers: { "content-type": "application/json;charset=UTF-8" },
      body: JSON.stringify(values, null, 2),
      signal: controller.current.signal,
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        setLoading(false);
        return res.json();
      })
      .then(data => setUsers(data))
      .catch(e => {
        if (e.name === "AbortError") {
          return;
        }
        console.error(e);
        setLoading(false);
      });
  };

  const FormSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required field"),
  });

  const hundlerSubmit = (values: IForm, action: FormikHelpers<IForm>) => {
    if (controller.current) {
      controller.current.abort();
    }
    controller.current = new AbortController();
    const numberWithoutMask = values.number.replace(/-/g, "");
    getUsers({ email: values.email, number: numberWithoutMask });
  };

  return (
    <div className="App">
      <Formik
        initialValues={initialValues}
        onSubmit={hundlerSubmit}
        validationSchema={FormSchema}
      >
        {({ errors, touched }) => (
          <Form className="form-group">
            <div className="form-group__wrapper">
              <Field
                className={cn("form-group__input", {
                  "form-group__input_error": errors.email && touched.email,
                })}
                type="email"
                name="email"
                placeholder="E-Mail"
              />
              {errors.email && touched.email ? (
                <div className="form-group__error">{errors.email}</div>
              ) : null}
            </div>
            <div className="form-group__wrapper">
              <Field name="number">
                {({ field, form: { touched, errors } }) => {
                  return (
                    <MaskedInput
                      placeholder="Number"
                      className={cn("form-group__input", {
                        "form-group__input_error":
                          errors.number && touched.number,
                      })}
                      mask={[/[0-9]/, /\d/, "-", /\d/, /\d/, "-", /\d/, /\d/]}
                      {...field}
                    />
                  );
                }}
              </Field>
            </div>
            <button type="submit" className="form-group__button">
              {loading ? (
                <>
                  Loading
                  <Loader />
                </>
              ) : (
                <>Submit</>
              )}
            </button>
          </Form>
        )}
      </Formik>
      <div className="result-block">
        <h3 className="result-block__title">result of search</h3>
        <div className="result-block__content">
          {loading ? (
            <>Loading...</>
          ) : !!users.length ? (
            users.map((user, index) => {
              return (
                <div key={index}>
                  {user.email} {user.number}
                </div>
              );
            })
          ) : (
            <>Nothing</>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
