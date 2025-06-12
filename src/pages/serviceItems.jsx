import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  API_GET_SERVICE_ITEM,
  API_GET_SERVICE_BY_ID,
  API_POST_SERVICE_ITEM,
  API_UPDATE_SERVICE_ITEM,
  API_DELETE_SERVICE_ITEM,
} from "../apiConfig";
import {
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const ServiceItems = () => {
  const { serviceId } = useParams(); // <-- get serviceId from URL
  const [serviceItems, setServiceItems] = useState([]);
  const [serviceName, setServiceName] = useState("");
  const [newItem, setNewItem] = useState({
    item: "",
    type: "",
    unit_price: "",
    note: "",
  });
  const [editItem, setEditItem] = useState({
    id: "",
    item: "",
    type: "",
    unit_price: "",
    note: "",
  });
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServiceItems();
    fetchServiceName(); // <-- Add this
  }, [serviceId]);

  const fetchServiceName = async () => {
    try {
      const response = await axios.get(`${API_GET_SERVICE_BY_ID}/${serviceId}`);
      setServiceName(response.data.name);
    } catch (error) {
      console.error("Error fetching service name:", error);
    }
  };

  const fetchServiceItems = async () => {
    try {
      const response = await axios.get(`${API_GET_SERVICE_ITEM}/${serviceId}`);
      setServiceItems(response.data);
      if (response.data.length > 0) {
        setServiceName(response.data[0].services_items);
      }
    } catch (error) {
      console.error("Error fetching service items:", error);
    }
  };

  const handleAddNew = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewItem({ item: "", type: "", unit_price: "", note: "" });
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(API_POST_SERVICE_ITEM, {
        ...newItem,
        services_id: serviceId,
      });
      setServiceItems([...serviceItems, response.data]);
      handleClose();
    } catch (error) {
      console.error("Error saving service item:", error);
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditItem({ id: "", item: "", type: "", unit_price: "", note: "" });
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `${API_UPDATE_SERVICE_ITEM}/${editItem.id}`,
        {
          item: editItem.item,
          type: editItem.type,
          unit_price: editItem.unit_price,
          note: editItem.note,
        }
      );
      setServiceItems(
        serviceItems.map((i) => (i.id === editItem.id ? response.data : i))
      );
      handleEditClose();
    } catch (error) {
      console.error("Error updating service item:", error);
    }
  };

  const handleDelete = (item) => {
    setDeleteTarget(item);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${API_DELETE_SERVICE_ITEM}/${deleteTarget.id}`);
      setServiceItems(serviceItems.filter((i) => i.id !== deleteTarget.id));
      setConfirmOpen(false);
      setDeleteTarget(null);
    } catch (error) {
      console.error("Error deleting service item:", error);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setDeleteTarget(null);
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        maxWidth: "99%",
      }}
    >
      <div className="topTable">
        <h2>
          <span
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/main/services")}
          >
            All Services
          </span>
          <IconButton aria-label="">
            <ArrowForwardIosIcon />
          </IconButton>
          {serviceName}
        </h2>
        <Button
          variant="text"
          color="success"
          startIcon={<AddIcon />}
          onClick={handleAddNew}
          className="tableBtn"
        >
          Add New
        </Button>
      </div>

      <TableContainer component={Paper} className="tableContainer">
        <Table className="tableCap">
          <TableHead>
            <TableRow
              backgroundColor={"var(--color-black)"}
              color={"var(--color-white)"}
            >
              <TableCell>No</TableCell>
              <TableCell>Item</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Note</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {serviceItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <div
                    style={{
                      flex: 1,
                      height: "64.5vh",
                      padding: "20px",
                      color: "#999",
                      display: "flex",
                      backgroundColor: "#f5f5f5",
                      borderRadius: "8px",
                    }}
                  >
                    <p style={{ textAlign: "center", margin: "auto" }}>
                      No data available
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              serviceItems.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.item}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.unit_price}</TableCell>
                  <TableCell>{item.note}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="edit"
                      onClick={() => handleEdit(item)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDelete(item)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Service Item</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Item"
            fullWidth
            value={newItem.item}
            onChange={(e) => setNewItem({ ...newItem, item: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="type-label">Type</InputLabel>
            <Select
              labelId="type-label"
              value={newItem.type}
              onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
              label="Type"
            >
              <MenuItem value="ft">Feet (ft)</MenuItem>
              <MenuItem value="in">Inch (in)</MenuItem>
              <MenuItem value="yd">Yard (yd)</MenuItem>
              <MenuItem value="m">Meter (m)</MenuItem>
              <MenuItem value="cm">Centimeter (cm)</MenuItem>
              <MenuItem value="mm">Millimeter (mm)</MenuItem>
              <MenuItem value="sqft">Square Feet (sqft)</MenuItem>
              <MenuItem value="sqm">Square Meter (sqm)</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Unit Price"
            fullWidth
            type="number"
            value={newItem.unit_price}
            onChange={(e) =>
              setNewItem({ ...newItem, unit_price: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Note"
            fullWidth
            value={newItem.note}
            onChange={(e) => setNewItem({ ...newItem, note: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Service Item</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Item"
            fullWidth
            value={editItem.item}
            onChange={(e) => setEditItem({ ...editItem, item: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="type-label">Type</InputLabel>
            <Select
              labelId="type-label"
              value={newItem.type}
              onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
              label="Type"
            >
              <MenuItem value="ft">Feet (ft)</MenuItem>
              <MenuItem value="in">Inch (in)</MenuItem>
              <MenuItem value="yd">Yard (yd)</MenuItem>
              <MenuItem value="m">Meter (m)</MenuItem>
              <MenuItem value="cm">Centimeter (cm)</MenuItem>
              <MenuItem value="mm">Millimeter (mm)</MenuItem>
              <MenuItem value="sqft">Square Feet (sqft)</MenuItem>
              <MenuItem value="sqm">Square Meter (sqm)</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Unit Price"
            fullWidth
            type="number"
            value={editItem.unit_price}
            onChange={(e) =>
              setEditItem({ ...editItem, unit_price: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Note"
            fullWidth
            value={editItem.note}
            onChange={(e) => setEditItem({ ...editItem, note: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleUpdate}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete */}
      <Dialog open={confirmOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete "{deleteTarget?.item}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ServiceItems;
