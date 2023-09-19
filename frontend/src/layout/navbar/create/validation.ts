const check = (key: any, values: any) => key in values;

export interface Validation {
    name: string,
};

const validations = (values: Validation) => {
    let errors: Partial<Validation> = {};
    if(check("name", values)){
        if(!values.name) {
            errors.name = "*";
        }
    } 
    return errors
}

export default validations