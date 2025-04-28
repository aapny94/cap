import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  API_GET_CONTRACT_TYPE,
  API_POST_CONTRACT_TYPE,
  API_UPDATE_CONTRACT_TYPE,
  API_DELETE_CONTRACT_TYPE,
  API_UPDATE_CONTRACT_TYPE_POSITIONS,
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
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

const ItemType = {
  ROW: "row",
};

// Draggable Row Component
const DraggableRow = ({
  contract,
  index,
  moveRow,
  handleEdit,
  handleDelete,
  handleRowClick,
}) => {
  const [, ref] = useDrag({
    type: ItemType.ROW,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType.ROW,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveRow(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <TableRow ref={(node) => ref(drop(node))} hover>
      {/* Column 1: Drag handle - No click event */}
      <TableCell>
        <DragIndicatorIcon />
      </TableCell>

      {/* Column 2, 3, 4: Clickable for row navigation */}
      <TableCell
        onClick={() => handleRowClick(contract)}
        style={{ cursor: "pointer" }}
      >
        {contract.position}
      </TableCell>
      <TableCell
        onClick={() => handleRowClick(contract)}
        style={{ cursor: "pointer" }}
      >
        {contract.name}
      </TableCell>
      <TableCell
        onClick={() => handleRowClick(contract)}
        style={{ cursor: "pointer" }}
      >
        {contract.notes}
      </TableCell>

      {/* Column 5: Action buttons - No row click event */}
      <TableCell align="right">
        <IconButton aria-label="edit" onClick={() => handleEdit(contract)}>
          <EditIcon />
        </IconButton>
        <IconButton aria-label="delete" onClick={() => handleDelete(contract)}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

const Contract = () => {
  const [contractTypes, setContractTypes] = useState([]);
  const [newContract, setNewContract] = useState({ name: "", notes: "" });
  const [editContract, setEditContract] = useState({
    id: "",
    name: "",
    notes: "",
  });
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Inside Contract Component
  const navigate = useNavigate();

  const handleRowClick = (contract) => {
    navigate(`/main/contract/${contract.id}`);
  };

  useEffect(() => {
    const fetchContractTypes = async () => {
      try {
        const response = await axios.get(API_GET_CONTRACT_TYPE);
        const sortedData = response.data.sort(
          (a, b) => a.position - b.position
        );
        setContractTypes(sortedData);
      } catch (error) {
        console.error("Error fetching contract types:", error);
      }
    };

    fetchContractTypes();
  }, []);

  const handleAddNew = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setNewContract({ name: "", notes: "" });
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(API_POST_CONTRACT_TYPE, newContract);
      setContractTypes([...contractTypes, response.data]);
      handleClose();
    } catch (error) {
      console.error("Error saving contract type:", error);
    }
  };

  const handleEdit = (contract) => {
    setEditContract(contract);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditContract({ id: "", name: "", notes: "" });
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `${API_UPDATE_CONTRACT_TYPE}/${editContract.id}`,
        {
          name: editContract.name,
          notes: editContract.notes,
        }
      );
      setContractTypes(
        contractTypes.map((contract) =>
          contract.id === editContract.id ? response.data : contract
        )
      );
      handleEditClose();
    } catch (error) {
      console.error("Error updating contract type:", error);
    }
  };

  const handleDelete = (contract) => {
    setDeleteTarget(contract);
    setConfirmOpen(true);
  };

  // Function to refresh the contract types data
  const refreshContractTypes = async () => {
    try {
      const response = await axios.get(API_GET_CONTRACT_TYPE);
      const sortedData = response.data.sort((a, b) => a.position - b.position);
      setContractTypes(sortedData);
    } catch (error) {
      console.error("Error refreshing contract types:", error);
    }
  };

  // Confirm deletion
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${API_DELETE_CONTRACT_TYPE}/${deleteTarget.id}`);
      await refreshContractTypes(); // Refresh the component data
      setConfirmOpen(false);
      setDeleteTarget(null);
    } catch (error) {
      console.error("Error deleting contract type:", error);
    }
  };

  // Cancel deletion
  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setDeleteTarget(null);
  };

  const moveRow = useCallback(
    (fromIndex, toIndex) => {
      const updatedContractTypes = [...contractTypes];

      // Move the row by swapping positions
      const [movedRow] = updatedContractTypes.splice(fromIndex, 1);
      updatedContractTypes.splice(toIndex, 0, movedRow);

      // Recalculate positions based on new order
      const updates = updatedContractTypes.map((contract, index) => ({
        id: contract.id,
        newPosition: index + 1, // Ensure positions start at 1 and increment
      }));

      // Update the frontend state with new positions
      const updatedContractTypesWithPositions = updatedContractTypes.map(
        (contract, index) => ({
          ...contract,
          position: index + 1,
        })
      );

      setContractTypes(updatedContractTypesWithPositions);

      // Send the updated positions to the backend
      axios
        .put(API_UPDATE_CONTRACT_TYPE_POSITIONS, { updates })
        .then(() => {
          console.log("Positions updated successfully");
        })
        .catch((error) => {
          console.error("Error updating contract type positions:", error);
        });
    },
    [contractTypes]
  );

  const renderTableBody = () => {
    if (contractTypes.length === 0) {
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

    return contractTypes.map((contract, index) => (
      <DraggableRow
        key={contract.id}
        index={index}
        contract={contract}
        moveRow={moveRow}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleRowClick={handleRowClick}
      />
    ));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ flex: 1, display: "flex", maxWidth: "99%" }}>
        <div className="table">
          <div className="topTable">
            <h2>All Contracts</h2>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddNew}
              className="userBtn"
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
                  <TableCell width={"2%"}></TableCell>
                  <TableCell width={"4%"}>No</TableCell>
                  <TableCell flex={"1"}>Name</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{renderTableBody()}</TableBody>
            </Table>
          </TableContainer>
        </div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add New Contract</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              fullWidth
              value={newContract.name}
              onChange={(e) =>
                setNewContract({ ...newContract, name: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Notes"
              fullWidth
              value={newContract.notes}
              onChange={(e) =>
                setNewContract({ ...newContract, notes: e.target.value })
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
        <Dialog open={editOpen} onClose={handleEditClose}>
          <DialogTitle>Edit Contract</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              fullWidth
              value={editContract.name}
              onChange={(e) =>
                setEditContract({ ...editContract, name: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Notes"
              fullWidth
              value={editContract.notes}
              onChange={(e) =>
                setEditContract({ ...editContract, notes: e.target.value })
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
        <Dialog open={confirmOpen} onClose={handleCancelDelete}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            Are you sure you want to delete the contract "{deleteTarget?.name}"?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="secondary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </DndProvider>
  );
};

export default Contract;
