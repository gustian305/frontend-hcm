import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { sidebarItems } from "../../config/SidebarMenu";
import { X, Plus, Pencil, Trash2, Building, ListTodo } from "lucide-react";
import { useEffect, useState } from "react";
import { WorkPlanRequest } from "../../service/workPlanTaskService";
import {
  createWorkPlan,
  deleteWorkPlan,
  getAllWorkPlans,
  updateWorkPlan,
} from "../../store/slices/workPlanTaskSlice";
import ModalForm from "../modal/FormModal";
import { fetchDepartment } from "../../store/slices/departmentSlice";
import ModalAlert from "../modal/AlertModal";
import HumadifyLogo from "../../assets/HumadifyPrimary.svg"

interface SidebarProps {
  className?: string;
  toggleSidebar?: () => void;
}

const Sidebar = ({ className, toggleSidebar }: SidebarProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const userPermission = useSelector(
    (state: RootState) => state.auth.userInfo?.permission || []
  );
  const departmentData = useSelector(
    (state: RootState) => state.department.departmentData?.data || []
  );

  useEffect(() => {
    dispatch(fetchDepartment());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllWorkPlans());
  }, [dispatch]);

  const userPermissionNames = userPermission.map(
    (p: { name: string }) => p.name
  );

  const [alert, setAlert] = useState({
    open: false,
    type: "success" as "success" | "error" | "confirm",
    message: "",
    onConfirm: () => {},
  });

  // === Work Plan State ===
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [workPlanOpen, setWorkPlanOpen] = useState(false);
  const [showWorkPlanModal, setShowWorkPlanModal] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [tempSelected, setTempSelected] = useState<string[]>([]);

  const workPlans = useSelector(
    (state: RootState) => state.workPlanTask.workPlans?.data || []
  );

  const filteredMenu = sidebarItems.filter((item) =>
    item.permission?.some((p) => userPermissionNames.includes(p))
  );

  const handleCreateWorkPlan = async (values: WorkPlanRequest) => {
    await dispatch(createWorkPlan(values)).unwrap();
    await dispatch(getAllWorkPlans());
  };

  return (
    <>
      <aside
        className={`
    fixed left-0 top-0 
    flex flex-col 
    h-screen 
    w-64 md:w-72 
    overflow-hidden 
    ${className}
  `}
        style={{ backgroundColor: "#05445E" }}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between px-3">
          <img
            src={HumadifyLogo}
            alt="Humadify"
            className="h-12 md:h-14 w-auto"
          />
          {toggleSidebar && (
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded hover:bg-[#05445E]"
            >
              <X size={20} className="text-white" />
            </button>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar pr-1">
          <ul className="space-y-1 px-1">
            {/* Static Menu */}
            {filteredMenu
              .filter((m) => !m.isDynamic)
              .map((item) => (
                <li key={item.title}>
                  <NavLink
                    to={item.route!}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                        isActive
                          ? "bg-[#EEEEEE] text-[#05445E] font-semibold"
                          : "text-[#EEEEEE] hover:bg-blue-700 font-medium"
                      }`
                    }
                  >
                    {item.icon && <span>{item.icon}</span>}
                    {item.title}
                  </NavLink>
                </li>
              ))}

            <hr className="border-gray-400 my-3 opacity-40" />

            {/* Work Plan Section */}
            <li className="px-1">
              <div
                className="flex justify-between items-center px-3 py-2 text-[#EEEEEE] cursor-pointer hover:bg-blue-700 rounded-md"
                onClick={() => setWorkPlanOpen(!workPlanOpen)}
              >
                <div className="flex items-center gap-2">
                  <ListTodo size={18} />
                  <span className="font-medium">Work Plan</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowWorkPlanModal(true);
                  }}
                  className="p-1 hover:bg-blue-600 rounded"
                >
                  <Plus size={18} className="text-white" />
                </button>
              </div>

              {/* Dynamic submenu */}
              {workPlanOpen && (
                <ul className="ml-5 mt-1 space-y-1">
                  {workPlans.length === 0 && (
                    <li className="text-gray-300 text-sm italic ml-2">
                      No data
                    </li>
                  )}

                  {workPlans.map((wp: any) => {
                    const maxLen = 12;
                    const shortName =
                      wp.name.length > maxLen
                        ? wp.name.substring(0, maxLen) + "..."
                        : wp.name;

                    return (
                      <li
                        key={wp.id}
                        className="flex items-center justify-between"
                      >
                        {/* Link Work Plan */}
                        <NavLink
                          to={`/work-plan/${wp.id}`}
                          className={({ isActive }) =>
                            `flex-1 px-1 py-1 rounded-md truncate whitespace-nowrap ${
                              isActive
                                ? "bg-[#EEEEEE] text-[#05445E] font-semibold"
                                : "text-[#EEEEEE] hover:bg-blue-700 font-medium"
                            }`
                          }
                        >
                          {shortName}
                        </NavLink>

                        {/* Action Button */}
                        <div className="flex items-center gap-2 ml-2">
                          <button
                            className="p-1 rounded hover:bg-blue-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditMode(true);
                              setEditData(wp);

                              // preload department
                              setSelectedDepartments(wp.department || []);

                              setShowWorkPlanModal(true);
                            }}
                          >
                            <Pencil size={16} className="text-yellow-300" />
                          </button>

                          <button
                            className="p-1 rounded hover:bg-blue-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              setAlert({
                                open: true,
                                type: "confirm",
                                message: `Hapus work plan "${wp.name}" ?`,
                                onConfirm: async () => {
                                  setAlert({ ...alert, open: false });

                                  try {
                                    await dispatch(
                                      deleteWorkPlan(wp.id)
                                    ).unwrap();
                                    await dispatch(getAllWorkPlans());

                                    setAlert({
                                      open: true,
                                      type: "success",
                                      message: "Work plan berhasil dihapus",
                                      onConfirm: () => {},
                                    });
                                  } catch (err: any) {
                                    setAlert({
                                      open: true,
                                      type: "error",
                                      message: "Gagal menghapus work plan",
                                      onConfirm: () => {},
                                    });
                                  }
                                },
                              });
                            }}
                          >
                            <Trash2 size={16} className="text-red-300" />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {showWorkPlanModal && (
        <ModalForm<WorkPlanRequest>
          title={editMode ? "Edit Work Plan" : "Create Work Plan"}
          initialValues={
            editMode
              ? {
                  name: editData.name,
                  description: editData.description,
                  startDate: editData.start_date,
                  endDate: editData.end_date,
                  status: editData.status,
                  department: editData.department,
                }
              : {
                  name: "",
                  description: "",
                  startDate: "",
                  endDate: "",
                  status: "To Do",
                  department: [],
                }
          }
          onSubmit={async (values) => {
            try {
              if (editMode) {
                await dispatch(
                  updateWorkPlan({
                    id: editData.id,
                    payload: {
                      ...values,
                      department: selectedDepartments,
                    },
                  })
                ).unwrap();

                setAlert({
                  open: true,
                  type: "success",
                  message: "Work Plan berhasil diperbarui",
                  onConfirm: () => {},
                });
              } else {
                await handleCreateWorkPlan({
                  ...values,
                  department: selectedDepartments,
                });

                setAlert({
                  open: true,
                  type: "success",
                  message: "Work Plan berhasil dibuat",
                  onConfirm: () => {},
                });
              }

              setShowWorkPlanModal(false);
              setEditMode(false);
              setEditData(null);
              setSelectedDepartments([]);

              await dispatch(getAllWorkPlans());
            } catch (err: any) {
              setAlert({
                open: true,
                type: "error",
                message: "Terjadi kesalahan, coba lagi",
                onConfirm: () => {},
              });
            }
          }}
          onClose={() => {
            setShowWorkPlanModal(false);
            setEditMode(false);
            setEditData(null);
            setSelectedDepartments([]);
          }}
        >
          {(values, setValues) => {
            const [showDropdown, setShowDropdown] = useState(false);

            const toggleDepartment = (id: string) => {
              if (selectedDepartments.includes(id)) {
                setSelectedDepartments(
                  selectedDepartments.filter((d) => d !== id)
                );
              } else {
                setSelectedDepartments([...selectedDepartments, id]);
              }
            };

            const removeDepartment = (id: string) => {
              setSelectedDepartments(
                selectedDepartments.filter((d) => d !== id)
              );
            };

            return (
              <div className="flex flex-col gap-4">
                {/* Name */}
                <div>
                  <label className="block font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={values.name}
                    onChange={(e) =>
                      setValues({ ...values, name: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block font-medium mb-1">Description</label>
                  <textarea
                    value={values.description}
                    onChange={(e) =>
                      setValues({ ...values, description: e.target.value })
                    }
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-1">Start Date</label>
                    <input
                      type="date"
                      value={values.startDate}
                      onChange={(e) =>
                        setValues({ ...values, startDate: e.target.value })
                      }
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">End Date</label>
                    <input
                      type="date"
                      value={values.endDate}
                      onChange={(e) =>
                        setValues({ ...values, endDate: e.target.value })
                      }
                      className="w-full border px-3 py-2 rounded"
                      required
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block font-medium mb-1">Status</label>
                  <select
                    className="w-full border px-3 py-2 rounded"
                    value={values.status}
                    onChange={(e) =>
                      setValues({ ...values, status: e.target.value })
                    }
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>

                {/* Department multi-select */}
                <div>
                  <label className="block font-medium mb-1">Department</label>
                  <div className="relative">
                    <div
                      className="mt-1 border rounded-md shadow-sm p-2 cursor-pointer"
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      Pilih Department
                    </div>

                    {showDropdown && (
                      <div className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto bg-white border rounded shadow-lg p-2">
                        {departmentData.map((dep: any) => {
                          const isSelected = selectedDepartments.includes(
                            dep.id
                          );
                          return (
                            <div
                              key={dep.id}
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedDepartments(
                                    selectedDepartments.filter(
                                      (d) => d !== dep.id
                                    )
                                  );
                                } else {
                                  setSelectedDepartments([
                                    ...selectedDepartments,
                                    dep.id,
                                  ]);
                                }
                              }}
                              className={`flex items-center justify-between p-1 cursor-pointer rounded hover:bg-gray-100 ${
                                isSelected ? "bg-gray-200" : ""
                              }`}
                            >
                              <span>{dep.name}</span>
                              {isSelected && (
                                <span className="text-green-500 font-bold">
                                  ✓
                                </span>
                              )}
                            </div>
                          );
                        })}

                        <button
                          type="button"
                          className="mt-2 w-full bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                          onClick={() => {
                            setSelectedDepartments([
                              ...selectedDepartments,
                              ...tempSelected.filter(
                                (id) => !selectedDepartments.includes(id)
                              ),
                            ]);
                            setTempSelected([]);
                            setShowDropdown(false);
                          }}
                        >
                          Pilih
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Selected Departments */}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedDepartments.map((id) => {
                      const dep = departmentData.find((d: any) => d.id === id);
                      if (!dep) return null;
                      return (
                        <div
                          key={id}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1"
                        >
                          {dep.name}
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedDepartments(
                                selectedDepartments.filter((d) => d !== id)
                              )
                            }
                            className="text-blue-600 font-bold"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          }}
        </ModalForm>
      )}
      <ModalAlert
        open={alert.open}
        type={alert.type as any}
        message={alert.message}
        onClose={() => setAlert({ ...alert, open: false })}
        onConfirm={alert.onConfirm}
      />
    </>
  );
};

export default Sidebar;
