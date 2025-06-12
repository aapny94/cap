import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  API_GET_CONTRACT_ITEM,
  API_GET_CONTRACT_TYPE,
  API_POST_CONTRACT_ITEM,
  API_UPDATE_CONTRACT_ITEM,
  API_DELETE_CONTRACT_ITEM,
  API_UPDATE_CONTRACT_ITEM_POSITIONS,
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
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

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

  const [isEditMode, setIsEditMode] = useState(false);
  const [originalOrder, setOriginalOrder] = useState([]);

  const ItemType = { ROW: "row" };

  const DraggableRow = ({
    item,
    index,
    moveRow,
    handleEdit,
    handleDelete,
    isEditMode,
  }) => {
    const [, ref] = useDrag({
      type: ItemType.ROW,
      item: { index },
      canDrag: isEditMode,
    });

    const [, drop] = useDrop({
      accept: ItemType.ROW,
      hover: (draggedItem) => {
        if (draggedItem.index !== index && isEditMode) {
          moveRow(draggedItem.index, index);
          draggedItem.index = index;
        }
      },
    });

    return (
      <TableRow ref={(node) => ref(drop(node))} hover>
        <TableCell>
          {isEditMode ? <DragIndicatorIcon /> : item.position_item}
        </TableCell>
        <TableCell>{item.content}</TableCell>
        <TableCell>{item.notes}</TableCell>
        <TableCell align="right">
          <IconButton
            aria-label="edit"
            onClick={() => handleEdit(item)}
            disabled={isEditMode}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => handleDelete(item)}
            disabled={isEditMode}
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  };

  const moveRow = (fromIndex, toIndex) => {
    const updatedItems = [...contractItems];
    const [movedItem] = updatedItems.splice(fromIndex, 1);
    updatedItems.splice(toIndex, 0, movedItem);

    const updatedItemsWithPositions = updatedItems.map((item, index) => ({
      ...item,
      position_item: index + 1,
    }));

    setContractItems(updatedItemsWithPositions);
  };

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

  //function to REFRESH the contract items after deletion
  const refreshContractItems = async () => {
    try {
      const response = await axios.get(
        API_GET_CONTRACT_ITEM + `/${contractTypeId}`
      );
      const sortedData = response.data.sort(
        (a, b) => parseInt(a.position_item, 10) - parseInt(b.position_item, 10)
      );
      setContractItems(sortedData);
    } catch (error) {
      console.error("Error refreshing contract items:", error);
    }
  };

  const handleDelete = (item) => {
    setDeleteTarget(item);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${API_DELETE_CONTRACT_ITEM}/${deleteTarget.id}`);
      setContractItems(
        contractItems.filter((item) => item.id !== deleteTarget.id)
      );
      await refreshContractItems();
      setConfirmOpen(false);
      setDeleteTarget(null);
    } catch (error) {
      console.error("Error deleting contract item:", error);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setDeleteTarget(null);
  };

  const handleEnterEditMode = () => {
    setOriginalOrder([...contractItems]); // Save original order
    setIsEditMode(true);
  };

  const handleCancelEditMode = () => {
+   setContractItems(originalOrder); // <-- Should be this!
    setIsEditMode(false);
  };

  const handleSaveOrder = async () => {
  const updates = contractItems.map((item, index) => ({
    id: item.id,
    newPosition: index + 1,
  }));

  console.log("Sending Updates:", JSON.stringify({ updates }, null, 2)); // ADD THIS

  try {
    await axios.put(API_UPDATE_CONTRACT_ITEM_POSITIONS, { updates }, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("Positions updated successfully");
    setIsEditMode(false);
  } catch (error) {
    console.error("Error updating contract item positions:", error);
  }
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
      <DraggableRow
        key={item.id}
        index={index}
        item={item}
        moveRow={isEditMode ? moveRow : () => {}}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        isEditMode={isEditMode}
      />
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

          <div style={{ display: "flex", gap: "8px" }}>
            {!isEditMode && (
              <Button
                variant="text"
                color="success"
                startIcon={<AddIcon />}
                onClick={handleAddNew}
                className="tableBtn"
              >
                Add New
              </Button>
            )}
            {!isEditMode ? (
              <Button
                variant="text"
                color="primary"
                startIcon={<EditIcon />}
                onClick={handleEnterEditMode}
                className="tableBtn"
              >
                Edit Order
              </Button>
            ) : (
              <>
                <Button
                  variant="text"
                  color="primary"
                  startIcon={<CheckIcon />}
                  onClick={handleSaveOrder}
                  className="tableBtn"
                >
                  Save Order
                </Button>
                <Button
                  variant="text"
                  color="secondary"
                  startIcon={<ClearIcon />}
                  onClick={handleCancelEditMode}
                  className="tableBtn"
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
        <DndProvider backend={HTML5Backend}>
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
        </DndProvider>
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
          <Button onClick={handleEditClose} sx={{ color: "red" }}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} sx={{ color: "red" }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={handleCancelDelete}>
        <DialogTitle sx={{ paddingTop: "1.5rem", textAlign: "center" }}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          Are you sure you want to delete the contract item "
          {deleteTarget?.position_item}"?
        </DialogContent>
        <DialogActions sx={{ paddingBottom: "20px", margin: "auto" }}>
          <Button onClick={handleCancelDelete} sx={{ color: "red" }}>
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} sx={{ color: "red" }}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ContractItem;

// Dragable function belum implement
// api untuk delete belum create
// api untuk create new contract item ada masalah
