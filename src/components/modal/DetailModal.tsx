// src/components/modal/DetailModal.tsx
import React, { useState } from "react";
import { 
  X, 
  Download, 
  File, 
  Calendar, 
  User, 
  Mail, 
  Building, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Folder,
  Eye,
  Printer
} from "lucide-react";

interface DetailField {
  key: string;
  label: string;
  render?: (value: any) => React.ReactNode;
  icon?: React.ReactNode;
  type?: "text" | "date" | "email" | "file" | "status" | "array" | "custom" | "section" | "currency";
  className?: string;
  hideIfEmpty?: boolean;
  format?: string;
}

interface Props {
  title: string;
  open: boolean;
  onClose: () => void;
  data: any | null;
  fields: DetailField[];
  width?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "full";
  maxHeight?: string;
  showHeaderIcon?: boolean;
  headerColor?: string;
  showFooter?: boolean;
  gridColumns?: number;
  loading?: boolean;
  onPrint?: () => void;
  onExport?: () => void;
  children?: React.ReactNode;
  customStyles?: {
    content?: string;
    body?: string;
    header?: string;
    footer?: string;
  };
}

const ModalDetail: React.FC<Props> = ({
  title,
  open,
  onClose,
  data,
  fields,
  width = "lg",
  maxHeight = "max-h-[70vh]",
  showHeaderIcon = true,
  headerColor = "#189AB4",
  showFooter = true,
  gridColumns = 1,
  loading = false,
  onPrint,
  onExport,
  children,
  customStyles = {},
}) => {
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  if (!open) return null;

  const widthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    full: "max-w-full mx-4",
  };

  const gridColsClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  // Toggle section collapse
  const toggleSection = (key: string) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  // Helper function to render field value
  const renderValue = (field: DetailField, value: any) => {
    if (field.render) {
      return field.render(value);
    }

    switch (field.type) {
      case "file":
        return value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#189AB4] hover:text-[#14829A] transition-colors font-medium group"
          >
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              <File className="w-4 h-4" />
              <span>Download File</span>
              <Download className="w-4 h-4" />
            </div>
          </a>
        ) : (
          <span className="text-gray-400 italic">No file</span>
        );

      case "email":
        return (
          <a 
            href={`mailto:${value}`}
            className="text-[#189AB4] hover:text-[#14829A] hover:underline transition-colors flex items-center gap-1"
          >
            <Mail className="w-4 h-4" />
            {value || "-"}
          </a>
        );

      case "date":
        if (!value) return <span className="text-gray-400 italic">-</span>;
        
        try {
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            return value;
          }
          
          return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        } catch {
          return value;
        }

      case "status":
        if (value === null || value === undefined) return <span className="text-gray-400 italic">-</span>;
        
        const isActive = typeof value === 'string' 
          ? value.toLowerCase() === 'active'
          : value === true;
        
        return (
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${isActive ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
            {isActive ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
            {typeof value === 'boolean' ? (value ? 'Active' : 'Inactive') : value}
          </span>
        );

      case "currency":
        if (!value && value !== 0) return <span className="text-gray-400 italic">-</span>;
        
        const formatter = new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
        });
        return (
          <span className={`font-medium ${field.className?.includes('text-') ? '' : 'text-emerald-600'}`}>
            {formatter.format(Number(value))}
          </span>
        );

      case "array":
        if (!Array.isArray(value) || value.length === 0) {
          return <span className="text-gray-400 italic">-</span>;
        }
        
        return (
          <div className="space-y-2">
            {value.map((item, index) => (
              <div 
                key={index}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700"
              >
                {typeof item === 'object' ? JSON.stringify(item) : item}
              </div>
            ))}
          </div>
        );

      case "custom":
        return value || <span className="text-gray-400 italic">-</span>;

      case "section":
        return null; // Section headers don't render value

      default:
        if (Array.isArray(value)) {
          return value.length ? (
            <div className="flex flex-wrap gap-1">
              {value.map((item, idx) => (
                <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                  {item}
                </span>
              ))}
            </div>
          ) : <span className="text-gray-400 italic">-</span>;
        }
        
        if (value === null || value === undefined || value === '') {
          return <span className="text-gray-400 italic">-</span>;
        }
        
        return value.toString();
    }
  };

  // Default icons for common field types
  const getDefaultIcon = (key: string, type?: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      name: <User className="w-4 h-4" />,
      fullName: <User className="w-4 h-4" />,
      email: <Mail className="w-4 h-4" />,
      department: <Building className="w-4 h-4" />,
      role: <Users className="w-4 h-4" />,
      date: <Calendar className="w-4 h-4" />,
      joinedDate: <Calendar className="w-4 h-4" />,
      createdAt: <Calendar className="w-4 h-4" />,
      time: <Clock className="w-4 h-4" />,
      status: <CheckCircle className="w-4 h-4" />,
      fileUrl: <File className="w-4 h-4" />,
      picture: <User className="w-4 h-4" />,
      phone: <Users className="w-4 h-4" />,
      address: <Building className="w-4 h-4" />,
      salary: <File className="w-4 h-4" />,
      position: <Users className="w-4 h-4" />,
    };
    
    if (type === 'section') {
      return <Folder className="w-4 h-4" />;
    }
    
    return iconMap[key] || null;
  };

  // Group fields by section
  const groupFieldsBySection = () => {
    const groups: { fields: DetailField[], isSection?: boolean, key?: string, label?: string }[] = [];
    let currentGroup: DetailField[] = [];
    let currentSectionKey = '';
    let currentSectionLabel = '';

    fields.forEach((field, index) => {
      if (field.type === 'section') {
        // Save current group if exists
        if (currentGroup.length > 0) {
          groups.push({
            fields: currentGroup,
            isSection: true,
            key: currentSectionKey,
            label: currentSectionLabel
          });
        }
        
        // Start new section
        currentGroup = [];
        currentSectionKey = field.key;
        currentSectionLabel = field.label;
      } else {
        currentGroup.push(field);
        
        // If last field, save the group
        if (index === fields.length - 1) {
          groups.push({
            fields: currentGroup,
            isSection: currentSectionKey ? true : false,
            key: currentSectionKey,
            label: currentSectionLabel
          });
        }
      }
    });

    return groups;
  };

  const fieldGroups = groupFieldsBySection();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className={`relative z-10 bg-white rounded-2xl shadow-2xl ${widthClasses[width]} w-full animate-scaleIn ${customStyles.content || ''}`}>
        {/* Header */}
        <div 
          className={`px-6 py-5 rounded-t-2xl ${customStyles.header || ''}`}
          style={{ backgroundColor: headerColor }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {showHeaderIcon && (
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-semibold text-white truncate">{title}</h2>
                <p className="text-sm text-white/80 mt-1">
                  {data ? `${fields.filter(f => f.type !== 'section').length} fields` : "Loading..."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Action Buttons */}
              {onPrint && (
                <button
                  onClick={onPrint}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white/90 hover:text-white hover:bg-white/20 transition-colors"
                  title="Print"
                >
                  <Printer className="w-4 h-4" />
                </button>
              )}
              {onExport && (
                <button
                  onClick={onExport}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white/90 hover:text-white hover:bg-white/20 transition-colors"
                  title="Export"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white/90 hover:text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={`overflow-y-auto ${maxHeight} ${customStyles.body || 'p-6'}`}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-[#189AB4] rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-[#189AB4] animate-pulse" />
                </div>
              </div>
            </div>
          ) : data ? (
            <div className="space-y-6">
              {fieldGroups.map((group, groupIndex) => {
                // Skip if all fields in group should be hidden
                const visibleFields = group.fields.filter(field => {
                  if (field.hideIfEmpty && !data[field.key]) return false;
                  return true;
                });

                if (visibleFields.length === 0 && !group.isSection) return null;

                const isSectionCollapsed = group.isSection && collapsedSections.has(group.key || '');

                return (
                  <div key={group.key || `group-${groupIndex}`} className="space-y-4">
                    {/* Section Header */}
                    {group.isSection && group.label && (
                      <div 
                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all hover:bg-gray-50 ${isSectionCollapsed ? 'bg-gray-50 border-gray-200' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100'}`}
                        onClick={() => group.key && toggleSection(group.key)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isSectionCollapsed ? 'bg-gray-200' : 'bg-blue-100'}`}>
                            <Folder className={`w-5 h-5 ${isSectionCollapsed ? 'text-gray-600' : 'text-blue-600'}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{group.label}</h3>
                            <p className="text-sm text-gray-500">
                              {isSectionCollapsed ? "Click to expand" : `${visibleFields.length} fields`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {isSectionCollapsed ? "Collapsed" : "Expanded"}
                          </span>
                          {isSectionCollapsed ? (
                            <ChevronRight className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Section Content - Grid Layout */}
                    {(!group.isSection || !isSectionCollapsed) && visibleFields.length > 0 && (
                      <div className={`grid ${gridColsClasses[gridColumns as keyof typeof gridColsClasses] || gridColsClasses[1]} gap-4`}>
                        {visibleFields.map((field) => {
                          const value = data[field.key];
                          const icon = field.icon || getDefaultIcon(field.key, field.type);
                          
                          return (
                            <div
                              key={field.key}
                              className={`bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors ${field.className || ''}`}
                            >
                              <div className="flex items-start gap-3">
                                {icon && (
                                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600">
                                    {icon}
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                      {field.label}
                                    </dt>
                                    {field.type === 'status' && value && (
                                      <div className="text-xs text-gray-400">
                                        Status
                                      </div>
                                    )}
                                  </div>
                                  <dd className="text-gray-900">
                                    <div className="mt-1 break-words">
                                      {renderValue(field, value)}
                                    </div>
                                  </dd>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Divider between sections */}
                    {groupIndex < fieldGroups.length - 1 && (
                      <div className="border-t border-gray-200"></div>
                    )}
                  </div>
                );
              })}
              
              {/* Additional Children Content */}
              {children && (
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Additional Actions</h4>
                    <span className="text-sm text-gray-500">Optional</span>
                  </div>
                  <div className="space-y-3">
                    {children}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No Data Available
              </h3>
              <p className="text-gray-500 mb-4">
                The requested information could not be loaded.
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-[#189AB4] hover:text-[#14829A] hover:underline"
              >
                Close and try again
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {showFooter && (
          <div className={`px-6 py-4 border-t border-gray-200 bg-gray-50/50 backdrop-blur-sm rounded-b-2xl ${customStyles.footer || ''}`}>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 flex items-center gap-2">
                {data ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{fields.filter(f => f.type !== 'section').length} fields loaded</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-gray-400" />
                    <span>No data loaded</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-3">
                {onPrint && (
                  <button
                    onClick={onPrint}
                    className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 active:scale-[0.98] transition-all duration-200 font-medium text-sm flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    Print
                  </button>
                )}
                {onExport && (
                  <button
                    onClick={onExport}
                    className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 active:scale-[0.98] transition-all duration-200 font-medium text-sm flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-[#189AB4] text-white hover:bg-[#14829A] active:scale-[0.98] transition-all duration-200 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#189AB4]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ModalDetail;