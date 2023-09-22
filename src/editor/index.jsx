import React, { Component, } from 'react';
import RichTextEditor from 'react-rte';

class MyEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: RichTextEditor.createEmptyValue()
        };
    }

    componentDidMount() {
        if (this.props.edit && this.props.value
            && this.props.value.length > 0) {
            this.setState({
                value: RichTextEditor.createValueFromString(this.props.value, "html")
            });
        }
    }

    onChange = (value) => {
        this.setState({ value }, () => {
            const { getData, name } = this.props;
            if (getData) {
                // Send the changes up to the parent component as an HTML string.
                // This is here to demonstrate using `.toString()` but in a real app it
                // would be better to avoid generating a string on each change.
                getData(value.toString('html'), name);
            }
        });
    };

    render() {
        const { mL, height, width, background, placeholder } = this.props;
        return (
            <RichTextEditor
                placeholder={placeholder}
                value={this.state.value}
                onChange={this.onChange}
                rootStyle={{
                    background: background,
                    marginLeft: mL,
                    height: height,
                    width: width
                }}
                editorStyle={{
                    overflowY: "auto",
                    maxHeight: "100%"
                }}
            />
        );
    }
}

export default MyEditor;