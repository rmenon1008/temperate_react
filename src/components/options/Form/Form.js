import './Form.css';
import { useState, useEffect, useCallback, useRef, CSSProperties } from 'react';
import { useFormikContext, Formik, Field, ErrorMessage } from 'formik';
import _ from 'lodash';
import { ChevronLeft, ChevronRight } from 'styled-icons/heroicons-solid';

const Autosave = ({ debounceMs = 50 }) => {
  const formik = useFormikContext();
  const [isSaved, setIsSaved] = useState(false);
  const debouncedSubmit = useCallback(
    _.debounce(() => {
      return formik.submitForm().then(() => {
        setIsSaved(true)
        setTimeout(() => {
          setIsSaved(null)
        }, 1000);
      });
    }, debounceMs),
    [formik.submitForm, debounceMs],
  );

  useEffect(() => debouncedSubmit, [debouncedSubmit, formik.values]);

  return (
    <div className="autosave-indicator">
      {!!formik.isSubmitting
        ? (<span>Saving...</span>)
        : isSaved
          ? (<span className='just-saved'>Changes save automatically</span>)
          : (<span>Changes save automatically</span>)
      }
    </div>
  );
};

const ColorField = (props) => {
  const formik = useFormikContext();
  const initialVal = props.name.split('.').reduce((o, i) => o[i], formik.values);
  const [color, setColor] = useState(initialVal);

  const updateColor = (e) => {
    setColor(e.target.value);
    formik.handleChange(e);
  }

  return (
    <div className={'input input-color'}>
      <Field
        type="color"
        {...props}
        onChange={updateColor}
      />
      <label htmlFor={props.name} disabled={props.disabled}>
        <div className='label'>{props.label}</div>
        <div className='detail'>{color}</div>
      </label>
    </div>
  );
}

const SwitchField = (props) => {
  return (
    <div className='input input-switch'>
      <Field
        type="checkbox"
        {...props}
      />
      <label htmlFor={props.name} disabled={props.disabled}>
        <div className='label'>{props.label}</div>
        <div className='detail'>{props.detail}</div>
      </label>
    </div>
  );
}

const TextField = (props) => {
  const width = props.width || 100;
  return (
    <div className='input input-text' style={{ "--width": width + "%" }}>
      <label htmlFor={props.name} disabled={props.disabled}>
        <div className='label'>{props.label}</div>
        <div className='detail'>{props.detail}</div>
      </label>
      <Field
        type="text"
        {...props}
      />
    </div>
  );
}

const SliderField = (props) => {
  const formik = useFormikContext();
  const initialVal = props.name.split('.').reduce((o, i) => o[i], formik.values);
  const [value, setValue] = useState(initialVal);

  const updateValue = (e) => {
    setValue(e.target.value);
    formik.handleChange(e);
  }

  return (
    <div className='input input-slider'>
      <label htmlFor={props.name} disabled={props.disabled}>
        <div className='label'>{props.label}</div>
        <div className='value'>{parseFloat(value).toFixed(1)}</div>
        <div className='detail'>{props.detail}</div>
      </label>
      <Field
        type="range"
        onChange={updateValue}
        {...props}
      />
    </div>
  );
}
const BG_OPTIONS_API = 'http://api.rohanmenon.com/imageoptions';
const BackgroundPicker = (props) => {
  const imagePreviewRef = useRef(null);
  const formik = useFormikContext();
  const initialVal = props.name.split('.').reduce((o, i) => o[i], formik.values);
  const [index, setIndex] = useState(0);
  const [options, setOptions] = useState(null);

  useEffect(() => {
    fetch(BG_OPTIONS_API).then(res => res.json()).then(data => {
      console.log(data);
      setOptions(data);
    })
  }, []);

  useEffect(() => {
    if (options) {
      const newIndex = options.findIndex(o => o.key === initialVal);
      setIndex(newIndex);
    }
  }, [options]);

  useEffect(() => {
    if(options && options[index]) {
      console.log("Making image invisible");
      imagePreviewRef.current.style.opacity = 0;
      imagePreviewRef.current.addEventListener('load', () => {
        console.log("Making image visible");
        imagePreviewRef.current.style.opacity = 1;
      });
    }
  }, [options, index]);

  const updateValue = (val) => {
    setIndex(val);
    formik.setFieldValue(props.name, options[val].key);
  }

  const changeOption = (num) => {
    setIndex((prev) => {
      const newIndex = (prev + num) % options.length;
      if (newIndex < 0) {
        return options.length - 1;
      }
      formik.setFieldValue(props.name, options[newIndex].key);
      return newIndex
    });
  }

  return (
    <div className='background-picker' disabled={props.disabled}>
      <label htmlFor={props.name} disabled={props.disabled}>
        <div className='label'>{props.label}</div>
        <div className='detail'>{props.detail}</div>
      </label>
      <div className='background-picker-inner'>
        <button className='background-picker-button' onClick={() => changeOption(-1)}><ChevronLeft size={35} /></button>
        {options && options[index] && (
          <div className='background-picker-image-inner'>
            <b>{options[index].title}</b>
            <div className='detail'>{options[index].description}</div>
            <img width="100%" src={options[index].preview} ref={imagePreviewRef} className='background-picker-preview' />
          </div>
        )}
        <button className='background-picker-button' onClick={() => changeOption(1)}><ChevronRight size={35} /></button>
      </div>
      <div className='background-picker-dot-indicator'>
        {options && options[index] && options.map((o, i) => (
          <span key={i} onClick={() => updateValue(i)} className={i === index ? 'dot active' : 'dot'} />
        ))}
      </div>
    </div>
  );
}
export { Autosave, ColorField, SwitchField, TextField, SliderField, BackgroundPicker };