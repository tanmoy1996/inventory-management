import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import Person4OutlinedIcon from "@mui/icons-material/Person4Outlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";

const dashboardRoutes = [
  {
    id: 1,
    header: "",
    routes: [
      {
        path: `/dashboard`,
        name: "Dashboard",
        Icon: GridViewOutlinedIcon,
      },
    ],
  },
  {
    id: 2,
    header: "Management",
    routes: [
      {
        path: "/inventory",
        name: "Inventory",
        Icon: CategoryOutlinedIcon,
      },
      {
        path: "/purchases",
        name: "Purchases",
        Icon: ShoppingCartOutlinedIcon,
      },
      {
        path: "/challans",
        name: "Challans",
        Icon: LocalShippingOutlinedIcon,
      },
    ],
  },
  {
    id: 3,
    header: "People",
    routes: [
      {
        path: "/clients",
        name: "Clients",
        Icon: Person4OutlinedIcon,
      },
      {
        path: "/vendors",
        name: "Vendors",
        Icon: BusinessCenterOutlinedIcon,
      },
    ],
  },
];
export default dashboardRoutes;
