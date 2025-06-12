



import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  API_GET_CONTRACT_ITEM,
  API_GET_CONTRACT_TYPE,
  API_POST_CONTRACT_ITEM,
  API_UPDATE_CONTRACT_ITEM,
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
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const ContractItem = () => {
  const { contractTypeId } = useParams();
  const [contractItems, setContractItems] = useState([]);
  const [contractTypeName, setContractTypeName] = useState("");
  const [newItem, setNewItem] = useState({ content: "", notes: "" });
  const [editItem, setEditItem] = useState({ id: "", content: "", notes: "" });
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContractTypeName = async () => {
      try {
        const response = await axios.get(
          `${API_GET_CONTRACT_TYPE}/${contractTypeId}`
        );
        setContractTypeName(response.data.name); // depends on your API structure
      } catch (error) {
        console.error("Error fetching contract type name:", error);
      }
    };

    if (contractTypeId) {
      fetchContractTypeName();
    }
  }, [contractTypeId]);

  useEffect(() => {
    const fetchContractItems = async () => {
      try {
        const response = await axios.get(
          `${API_GET_CONTRACT_ITEM}/${contractTypeId}`
        );
        const sortedData = response.data.sort(
          (a, b) =>
            parseInt(a.position_item, 10) - parseInt(b.position_item, 10)
        );
        setContractItems(sortedData);
      } catch (error) {
        console.error("Error fetching contract items:", error);
      }
    };

    fetchContractItems();
  }, [contractTypeId]);

  const handleAddNew = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setNewItem({ content: "", notes: "" });
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(API_POST_CONTRACT_ITEM, {
        content: newItem.content,
        notes: newItem.notes,
        contract_type_id: contractTypeId,
      });
      setContractItems([...contractItems, response.data]);
      handleClose();
    } catch (error) {
      console.error("Error saving contract item:", error);
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditItem({ id: "", content: "", notes: "" });
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `${API_UPDATE_CONTRACT_ITEM}/${editItem.id}`,
        {
          content: editItem.content,
          notes: editItem.notes,
        }
      );
      setContractItems(
        contractItems.map((item) =>
          item.id === editItem.id ? response.data : item
        )
      );
      handleEditClose();
    } catch (error) {
      console.error("Error updating contract item:", error);
    }
  };

  const handleDelete = (item) => {
    setDeleteTarget(item);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setConfirmOpen(false);
    setDeleteTarget(null);
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setDeleteTarget(null);
  };

  const renderTableBody = () => {
    if (contractItems.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={5} align="center">
            <div className="noData">
              <p>No data available</p>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return contractItems.map((item, index) => (
      <TableRow key={item.id} hover>
        <TableCell>{item.position_item}</TableCell>
        <TableCell>{item.content}</TableCell>
        <TableCell>{item.notes}</TableCell>
        <TableCell align="right">
          <IconButton aria-label="edit" onClick={() => handleEdit(item)}>
            <EditIcon />
          </IconButton>
          <IconButton aria-label="delete" onClick={() => handleDelete(item)}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div style={{ flex: 1, display: "flex", maxWidth: "99%" }}>
      <div className="table">
        <div className="topTable">
          <h2 className="contractItemTitle">
            <span
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/main/contract")}
            >
              All Contracts
            </span>
            <IconButton aria-label="">
              <ArrowForwardIosIcon />
            </IconButton>
            {contractTypeName}
          </h2>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddNew}
            className="userBtn"
          >
            Add New Item
          </Button>
        </div>
        <TableContainer component={Paper} className="tableContainer">
          <Table className="tableCap">
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Content</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{renderTableBody()}</TableBody>
          </Table>
        </TableContainer>
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Item</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Content"
            fullWidth
            value={newItem.content}
            onChange={(e) =>
              setNewItem({ ...newItem, content: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Notes"
            fullWidth
            value={newItem.notes}
            onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
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
      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Contract Item</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Content"
            fullWidth
            value={editItem.content}
            onChange={(e) =>
              setEditItem({ ...editItem, content: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Notes"
            fullWidth
            value={editItem.notes}
            onChange={(e) =>
              setEditItem({ ...editItem, notes: e.target.value })
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
    </div>
  );
};

export default ContractItem;

// DROP Table contractitem and recreate balik and clear all data
// position colum make as table
// OR Find better solution untuk activekan dragable position change OR position change
// API untuk update position dah clear
// Tukar nama API untuk update position contract item
// Saparatekan contract item dan contract type model dan controller
