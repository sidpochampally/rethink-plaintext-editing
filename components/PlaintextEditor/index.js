import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { TrixEditor } from 'react-trix';
import css from './style.css';

function PlaintextEditor({ file, write }) {
  // console.log(file, write);
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      setValue(await file.text());
      setIsLoading(false);
    })();
  }, [file]);

  const handleEditorReady = (editor) => {
    editor.insertString(value);
  };

  const handleChange = (html, text) => {
    setValue(text);
  }

  const handleSave = () => {
    const saveFile = new File([value], file.name, {
      type: 'text/plain',
      lastModified: new Date()
    });
    write(saveFile);
  }

  return (
    <div className={css.editor}>
      {isLoading ? ( <h2>Loading the file to view or edit</h2> ) : (
        <>
          <TrixEditor
            onChange={handleChange}
            onEditorReady={handleEditorReady}
          />
          <button type="submit" onClick={handleSave}>Save</button>
        </>
      )}
    </div>
  );
}

PlaintextEditor.propTypes = {
  file: PropTypes.object,
  write: PropTypes.func
};

export default PlaintextEditor;
