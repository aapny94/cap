import {
  createService,
  createServiceItem,
  deleteService,
  deleteServiceItem,
  getAllServices,
  getServiceById,
  getServiceItemsByServiceId,
  updateService,
  updateServiceItem,
} from "../models/servicesModel.js";

export const getAllServicesController = async (req, res) => {
  try {
    const services = await getAllServices();
    res.status(200).json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const getServiceByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const service = await getServiceById(id);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.status(200).json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const createServiceController = async (req, res) => {
  const { name, notes } = req.body;
  try {
    if (!name ) {
      return res.status(400).json({ error: "Name and notes are required" });
    }
    const newService = await createService({ name, notes });
    res.status(201).json(newService);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const updateServiceController = async (req, res) => {
  const { id } = req.params;
  const { name, notes } = req.body;
  try {
    if (!name ) {
      return res.status(400).json({ error: "Name and notes are required" });
    }
    const updatedService = await updateService(id, { name, notes });
    if (!updatedService) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.status(200).json(updatedService);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteServiceController = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedService = await deleteService(id);
    if (!deletedService) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.status(200).json(deletedService);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const getServiceItemsByServiceIdController = async (req, res) => {
  const { serviceId } = req.params;
  try {
    const serviceItems = await getServiceItemsByServiceId(serviceId);
    res.status(200).json(serviceItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const createServiceItemController = async (req, res) => {
  const { item, type, unit_price, services_id, note } = req.body;
  try {
    if (!item || !type || !unit_price || !services_id) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const newServiceItem = await createServiceItem({
      item,
      type,
      unit_price,
      services_id,
      note,
    });
    res.status(201).json(newServiceItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const updateServiceItemController = async (req, res) => {
  const { id } = req.params;
  const { item, type, unit_price, note } = req.body;
  try {
    if (!item || !type || !unit_price) {
      return res
        .status(400)
        .json({ error: "Item, type, and unit price are required" });
    }
    const updatedServiceItem = await updateServiceItem(id, {
      item,
      type,
      unit_price,
      note,
    });
    if (!updatedServiceItem) {
      return res.status(404).json({ error: "Service item not found" });
    }
    res.status(200).json(updatedServiceItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteServiceItemController = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedServiceItem = await deleteServiceItem(id);
    if (!deletedServiceItem) {
      return res.status(404).json({ error: "Service item not found" });
    }
    res.status(200).json(deletedServiceItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
