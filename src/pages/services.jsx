import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  API_GET_SERVICE,
  API_POST_SERVICE,
  API_UPDATE_SERVICE,
  API_DELETE_SERVICE,
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Services = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ name: "", notes: "" });
  const [editService, setEditService] = useState({
    id: "",
    name: "",
    notes: "",
  });
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const navigate = useNavigate();

  const fetchServices = async () => {
    try {
      const response = await axios.get(API_GET_SERVICE);
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAddNew = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewService({ name: "", notes: "" });
  };

  const handleSave = async () => {
    if (!newService.name.trim()) {
      alert("Name is required!");
      return;
    }

    try {
      const payload = {
        name: newService.name,
        notes: newService.notes?.trim() ? newService.notes : null, // <-- force null if empty
      };

      const response = await axios.post(API_POST_SERVICE, payload);
      setServices([...services, response.data]);
      handleClose();
    } catch (error) {
      console.error("Error saving service:", error);
    }
  };

  const handleEdit = (service) => {
    setEditService(service);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditService({ id: "", name: "", notes: "" });
  };

  const handleUpdate = async () => {
    if (!editService.name.trim()) {
      alert("Name is required!");
      return;
    }

    try {
      const payload = {
        name: editService.name,
        notes: editService.notes?.trim() ? editService.notes : null, // <-- force null if empty
      };

      const response = await axios.put(
        `${API_UPDATE_SERVICE}/${editService.id}`,
        payload
      );
      setServices(
        services.map((service) =>
          service.id === editService.id ? response.data : service
        )
      );
      handleEditClose();
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  const handleDelete = (service) => {
    setDeleteTarget(service);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${API_DELETE_SERVICE}/${deleteTarget.id}`);
      setServices(services.filter((service) => service.id !== deleteTarget.id));
      setConfirmOpen(false);
      setDeleteTarget(null);
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setDeleteTarget(null);
  };

  const handleRowClick = (service) => {
    navigate(`/main/services/${service.id}`); // Navigate to service items
  };

  return (
    <div style={{ flex: 1, display: "flex", maxWidth: "99%" }}>
      <div className="table">
        <div
          className="topTable"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>All Services</h2>
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
                <TableCell>Name</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services.length === 0 ? (
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
                services.map((item, index) => (
                  <TableRow key={item.id} style={{ cursor: "pointer" }}>
                    <TableCell onClick={() => handleRowClick(item)}>
                      {index + 1}
                    </TableCell>
                    <TableCell onClick={() => handleRowClick(item)}>
                      {item.name}
                    </TableCell>{" "}
                    {/* <-- NOT item.item */}
                    <TableCell onClick={() => handleRowClick(item)}>
                      {item.notes}
                    </TableCell>{" "}
                    {/* <-- NOT item.note */}
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
          <DialogTitle>Add New Service</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              fullWidth
              value={newService.name}
              onChange={(e) =>
                setNewService({ ...newService, name: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Notes"
              fullWidth
              value={newService.notes}
              onChange={(e) =>
                setNewService({ ...newService, notes: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogActions>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={editOpen} onClose={handleEditClose}>
          <DialogTitle>Edit Service</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              fullWidth
              value={editService.name}
              onChange={(e) =>
                setEditService({ ...editService, name: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Notes"
              fullWidth
              value={editService.notes}
              onChange={(e) =>
                setEditService({ ...editService, notes: e.target.value })
              }
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
            Are you sure you want to delete "{deleteTarget?.name}"?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete}>Cancel</Button>
            <Button onClick={handleConfirmDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Services;
