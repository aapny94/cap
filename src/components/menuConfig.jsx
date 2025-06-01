import VillaIcon from "@mui/icons-material/Villa";
import PeopleIcon from "@mui/icons-material/People";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CreditCardIcon from '@mui/icons-material/CreditCard';

const menuConfig = [
    {
      path: "/main/", 
      label: "Dashboard",
      icon: <VillaIcon />,
      roles: ["SuperAdmin", "Director", "Admin", "SalesAgent"],
    },
    {
      path: "/main/user-management",
      label: "User Management",
      icon: <PeopleIcon />,
      roles: ["SuperAdmin", "Director", "Admin"],
    },
    {
      path: "/main/project-management",
      label: "Project Management",
      icon: <AccountTreeIcon />,
      roles: ["SuperAdmin", "Director", "SalesAgent",],
    },
    {
      path: "/main/leads",
      label: "Leads",
      icon: <DynamicFeedIcon />,
      roles: ["SuperAdmin", "Director", "SalesAgent",],
    },
    {
      path: "/main/quotations",
      label: "Quotations",
      icon: <RequestPageIcon />,
      roles: ["SuperAdmin", "Director", "SalesAgent",],
    },
    {
      path: "/main/services",
      label: "Services",
      icon: <ReceiptLongIcon />,
      roles: ["SuperAdmin", "Director", "Admin",],
    },
    {
      path: "/main/contract",
      label: "Contract",
      icon: <PictureAsPdfIcon />,
      roles: ["SuperAdmin", "Director", "Admin",],
    },
    {
      path: "/main/payment-terms",
      label: "Payment Terms",
      icon: <CreditCardIcon />,
      roles: ["SuperAdmin", "Director", "Admin",],
    },

  ];
  
  export default menuConfig;