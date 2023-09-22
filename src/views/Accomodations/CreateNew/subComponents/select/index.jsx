import React from "react";
import MultiSelect from "react-select";
import makeAnimated from "react-select/animated";
// Externals
import PropTypes from "prop-types";

// Material helpers
import { withStyles } from "@material-ui/core";

// Material components
import { FormControl } from "@material-ui/core";

// Component styles
import styles from "./style";

class SelectElement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            values: []
        }
        this.handleValues = this.handleValues.bind(this);
    }
    handleValues = (values) => {
        this.props.getValues(values);
    }
    render() {
        const { classes ,options} = this.props;
        const animatedComponents = makeAnimated();
        const vendorPlaceholder = {
            parent: "Select vendors",
            child: "Select vendors w/o Khoj"
        };
       
        return (
            <FormControl
                variant="outlined"
                fullWidth
                className={classes.formControl}>
                <MultiSelect
                    autoFocus={this.props.autoFocus}
                    styles={{
                        menu: (base) => ({
                            ...base,
                            zIndex: 999,

                        }),
                        menuPortal: (base) => ({
                            ...base,
                            zIndex: 999
                        })
                    }}
                    menuPortalTarget={document.body}
                    value={this.props.options && this.props.options ? this.props.options : null}
                    onChange={e => this.setState({
                        values: e
                    }, () => {
                        this.handleValues(this.state.values)
                    })}
                    closeMenuOnSelect={this.props.isMulti === false ? true : false}
                    components={animatedComponents}
                    placeholder={this.props.label}
                    isMulti={this.props.isMulti === false ? false : true}
                    options={this.props.data}
                />
            </FormControl>
        );
    }
}

SelectElement.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SelectElement);
