import { useState } from "react";

class Form {
  /**
   * Validate email
   * @see https://stackoverflow.com/a/14075810
   * @param str
   * @returns boolean
   */
  static validEmail(str) {
    let regex =
      /([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"(!#-[^-~ \t]|(\\[\t -~]))+")@[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?(\.[0-9A-Za-z-]{2,61})+/;
    return regex.test(str);
  }

  /**
   * Minimum length of string
   * @param str
   * @param length
   * @returns
   */
  static minLength(str, length) {
    let isInvalid = false;

    if (str.length < length) {
      isInvalid = true;
    }

    return isInvalid;
  }

  static #addError(obj, key, error) {
    if (!obj[key]) obj[key] = [];
    obj[key].push(error);
  }

  /**
   * Form Validator
   * @param  obj
   * @returns
   */
  static #validator(obj) {
    let entries = Object.entries(obj);
    let results = {};

    entries.map(([key, data]) => {
      data.value = data.input?.value || data.value || "";
      if (data.mustMatch && data.value !== data.mustMatch.value) {
        let error = data.mustMatch.error || `${key}'s value must match ${data.mustMatch.name}'s value`;
        this.#addError(results, key, error);
      }

      if (data.isRequired || data.input?.required) {
        if (data.value.length === 0) {
          this.#addError(results, key, "This field is required!");
        }
      }

      if (Form.minLength(data.value, data.minLength)) {
        this.#addError(results, key, `The ${key} must be at least ${data.minLength} characters.`);
      }

      if (data.isEmail && !Form.validEmail(data.value)) {
        this.#addError(results, key, `The ${key} must be a valid email.`);
      }

      return results;
    });

    return Object.keys(results).length ? results : null;
  }

  static validator(data = {}, errors = {}, field) {
    let isValid = true;

    let currentErrors;
    if (field) {
      for (const [key, value] of Object.entries(data)) {
        if (field === key) currentErrors = this.#validator({ [key]: value });
        else {
          let tempErrors = this.#validator({ [key]: value });

          // sync errors with currentErrors
          if (tempErrors == null) {
            delete errors[key];
          }
        }
      }
    }
    else currentErrors = this.#validator(data);

    // sync errors with currentErrors
    if (currentErrors != null) {
      for (const [key, value] of Object.entries(currentErrors)) {
        errors[key] = value;
      }
      isValid = false;
    }
    else {
      delete errors[field]
    }

    return { errors, isValid };
  }
}

export function Input({ type, className, name, value, id, placeholder, onChange, validator, required, children, onBlur, onFocus, focused, errors }) {
  let originalType = type;
  let [showPassword, setShowPassword] = useState(false);

  return (
    <div className={"mb-3 input-group " + (className || "")}>
      {required && <span className='asterisk'>*</span>}
      <input
        id={id}
        type={originalType === "password" ? (showPassword ? "text" : "password") : type}
        className={`form-control form-input ${errors[name] ? "is-invalid " : ""}`}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={e => {
          onChange?.(e); // call user-provided on-change
          validator?.(name)
        }}
        onBlur={onBlur}
        onFocus={onFocus}
        required={required}
      />
      {originalType === "password" && <span>
        <i onClick={() => setShowPassword(!showPassword)} className={showPassword ? "fa fa-eye-slash" : "fa fa-eye"} aria-hidden="true" id="eye"></i>{" "}
      </span>}
      {children}
      {errors[name] && (
        <div className="invalid-feedback text-start d-block">
          {errors[name][0]}
        </div>
      )}
    </div>
  )
}

export default Form;