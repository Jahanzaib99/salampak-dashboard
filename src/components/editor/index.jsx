import React from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './editor.css'
const MyEditor = (props) => {
  const [state, setState] = React.useState({});
  const html = props.value;
  const contentBlock = htmlToDraft(html);
  const { editorState } = state;
  const { onChange, placeholder, data  } = props

  React.useEffect(() => {
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      setState({
        editorState,
      });
    }
  }, []);
  
  React.useEffect(() => {
    console.log(data);
    if (data) {
      const contentBlock = htmlToDraft(data);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
        const editorState = EditorState.createWithContent(contentState);

        setState({
          editorState,
        });
      }
    }
    else if (!data) {
        setState({
          ...state,
          editorState: EditorState.createEmpty()
        })
    }
  }, [data]);


  const onEditorStateChange = (editorState) => {
    setState({
      ...state,
      editorState,
    });
  };

  return (
    <div className="editor-container">
        <Editor
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={(state) => {onEditorStateChange(state); onChange(draftToHtml(convertToRaw(state.getCurrentContent()))) }}
          placeholder={placeholder ? placeholder+"..." : "write..."}
        />
    </div>
  );
}
export default MyEditor;
