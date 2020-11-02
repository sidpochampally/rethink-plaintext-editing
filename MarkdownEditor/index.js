import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import MarkdownIt from 'markdown-it';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import css from './style.css';

//importing markdown editor
const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
  ssr: false
});

//initializing markdown parser for the editor
const mdParser = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});

function MarkdownEditor({ file, write }) {
  // console.log(file, write);
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    (async() => {
      setValue(await file.text());
      setIsLoading(false);
    })();
  }, [file]);

  const handleEditorChange = ({ html, text }) => {
    setValue(text);
  }

  const handleSave = () => {
    const saveFile = new File([value], file.name, {
      type: 'text/markdown',
      lastModified: new Date()
    });
    write(saveFile);
  }

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/react-markdown-editor-lite/1.2.2/index.min.css"
        />
      </Head>
      <div className={css.editor}>
        {isLoading ? ( <h3>Loading the file</h3> ) : (
          <MdEditor
            value={value}
            style={{ height: "350px "}}
            renderHTML={(text) => mdParser.render(text)}
            onChange={handleEditorChange}
            onBlur={handleSave}
          />
        )}
      </div>
    </>
  );
}

MarkdownEditor.propTypes = {
  file: PropTypes.object,
  write: PropTypes.func
};

export default MarkdownEditor;
