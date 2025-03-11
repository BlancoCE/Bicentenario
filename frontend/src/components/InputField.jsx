import PropTypes from "prop-types"

export const InputField = ({label, type, name, value, onChange, placeholder}) => {
    return (
        <div className="input-group">
            <label htmlFor="name">{label}</label>
            <input 
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required
            />
        </div>
    )
}

InputField.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
}