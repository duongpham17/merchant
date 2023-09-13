const check = (key: any, values: any) => key in values;

export interface Validation {
    name: string,
    quantity: number | string,
    price: number | string,
};

const validations = (values: Validation) => {
    let errors: Partial<Validation> = {};

    if(check("name", values)){
        if(!values.name) {
            errors.name = "*";
        }
    } 
    if(check("quantity", values)){
        if(!values.quantity) {
            errors.quantity = "*";
        }
    } 
    if(check("price", values)){
        if(!values.price) {
            errors.price = "*";
        }
    } 
    return errors
}

export default validations