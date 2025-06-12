import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  API_GET_PAYMENT_TERMS,
  API_POST_PAYMENT_TERM,
  API_UPDATE_PAYMENT_TERM,
  API_DELETE_PAYMENT_TERM,
} from "../apiConfig"; // ⬅️ Updated imports
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

const PaymentTerms = () => {
  const [paymentTerms, setPaymentTerms] = useState([]);
  const [newTerm, setNewTerm] = useState({ details: "" });
  const [editTerm, setEditTerm] = useState({ id: "", details: "" });
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchPaymentTerms();
  }, []);

  const fetchPaymentTerms = async () => {
    try {
      const response = await axios.get(API_GET_PAYMENT_TERMS);
      setPaymentTerms(response.data);
    } catch (error) {
      console.error("Error fetching payment terms:", error);
    }
  };

  const handleAddNew = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setNewTerm({ details: "" });
  };

  const handleSave = async () => {
    try {
      await axios.post(API_POST_PAYMENT_TERM, newTerm); // ✅ Correct POST API
      fetchPaymentTerms();
      handleClose();
    } catch (error) {
      console.error("Error saving payment term:", error);
    }
  };

  const handleEdit = (term) => {
    setEditTerm(term);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditTerm({ id: "", details: "" });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API_UPDATE_PAYMENT_TERM}/${editTerm.id}`, {
        details: editTerm.details,
      });
      fetchPaymentTerms();
      handleEditClose();
    } catch (error) {
      console.error("Error updating payment term:", error);
    }
  };

  const handleDelete = (term) => {
    setDeleteTarget(term);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${API_DELETE_PAYMENT_TERM}/${deleteTarget.id}`);
      fetchPaymentTerms();
      setConfirmOpen(false);
      setDeleteTarget(null);
    } catch (error) {
      console.error("Error deleting payment term:", error);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setDeleteTarget(null);
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
          <h2>Payment Terms</h2>
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
              <TableRow>
                <TableCell width={"4%"}>No</TableCell>
                <TableCell>Details</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paymentTerms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <div className="noData">
                      <p>No data available</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paymentTerms.map((term, index) => (
                  <TableRow key={term.id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{term.details}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="edit"
                        onClick={() => handleEdit(term)}
                      >
                        <EditIcon />
                      </IconButton>
                      {term.id !== 1 && term.id !== 2 && (
                        <IconButton
                          aria-label="delete"
                          onClick={() => handleDelete(term)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Add New Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Payment Term</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Details"
            fullWidth
            value={newTerm.details}
            onChange={(e) =>
              setNewTerm({ ...newTerm, details: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Payment Term</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Details"
            fullWidth
            value={editTerm.details}
            onChange={(e) =>
              setEditTerm({ ...editTerm, details: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the payment term "
          {deleteTarget?.details}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PaymentTerms;
