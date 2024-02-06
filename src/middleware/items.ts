import Items from '../models/items';

export const newFields = async () => {
    try {
        // Update documents that do not have 'buy' and 'sell' fields
        await Items.updateMany(
          { sell: { $exists: false }, buy: { $exists: false } },
          { $set: { buy: 0, sell: 0 } } // Set default values for buy and sell
        );
        console.log("done");
    } catch (error) {
    console.error("Error:", error);
    }
}   

export const updateAll = async () => {
    const items = await Items.find();

    for(let x of items){   
        await Items.findByIdAndUpdate(x._id, x, {new: true});
        console.log(x._id, "updated");
    };

    console.log("done");
}   

export const deleteFields = async () => {
    try {
      await Items.updateMany(
        {}, // Empty filter object to match all documents
        { $unset: { price: 1, sold: 1 } }
      );
      console.log(`Fields deleted`);
    } catch (error) {
      console.error("Error:", error);
    }
};