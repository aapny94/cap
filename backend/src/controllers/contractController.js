import {
  getAllContractsType,
  getContractsItemByType,
  createNewContractType,
  updateContractTypePositions,
  updateContractType,
  deleteContractType,
  getContractTypeById,
  createNewContractItem,
  updateContractItem,
} from "../models/contractModel.js";

// This API will list all the contractType
export const listAllContractsType = async (req, res) => {
  try {
    const contractType = await getAllContractsType();
    res.json(contractType);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Controller to handle the update request and response
export const updateContractTypeController = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the ID is passed as a URL parameter
    const { name, notes } = req.body;

    const updatedContractType = await updateContractType(id, name, notes);

    if (!updatedContractType) {
      return res.status(404).json({ error: "Contract type not found" });
    }

    res.status(200).json(updatedContractType);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


// This API will delete a contract type and its associated items
export const deleteContractTypeController = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedContractType = await deleteContractType(id);
    res.status(200).json(deletedContractType);
  } catch (error) {
    console.error("Error in deleteContractTypeController:", error);
    res.status(500).json({ error: error.message });
  }
};

// Example usage of updateContractTypePositions
export const updateContractTypePositionController = async (req, res) => {
  try {
    const { updates } = req.body;

    // Validate input
    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ error: "Invalid updates format" });
    }

    // Update positions using the model function
    await updateContractTypePositions(updates);

    res.status(200).json({ message: "Positions updated successfully" });
  } catch (error) {
    console.error("Error updating contract type positions:", error);
    res.status(500).json({ error: "Failed to update contract type positions" });
  }
};

// This API will create a new contract type
export const createNewContractTypeController = async (req, res) => {
  try {
    const { name, notes } = req.body;
    const newContractType = await createNewContractType(name, notes);
    res.status(201).json(newContractType);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


// Controller function to get a contract type by ID
export const getContractTypeByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const contractType = await getContractTypeById(id);
    if (!contractType) {
      return res.status(404).json({ message: 'Contract type not found' });
    }
    res.status(200).json(contractType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// This API will list all the contractItem by contract_type_id
export const listAllContractsItemByType = async (req, res) => {
  try {
    const { contract_type_id } = req.params;
    const contractItems = await getContractsItemByType(contract_type_id);
    res.json(contractItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};



// This API will create a new contract item
export const createNewContractItemController = async (req, res) => {
  try {
    const { content, contract_type_id, notes } = req.body;
    const newContractItem = await createNewContractItem(content, contract_type_id, notes);
    res.status(201).json(newContractItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};



// This API will update a contract item
export const updateContractItemController = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, notes } = req.body;
    const updatedContractItem = await updateContractItem(id, content, notes);
    res.status(200).json(updatedContractItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

