import { AlertTriangle, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../ui/toast";
import { branchApi } from "../../../api/branchApi";
import type { Branch } from "../../../types/branch.types";
import Button from "../../ui/Button";

interface DeleteBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  branch: Branch | null;
}

const DeleteBranchModal = ({
  isOpen,
  onClose,
  branch,
}: DeleteBranchModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => branchApi.deleteBranch(branch!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      toast.success(`Branch "${branch?.name}" deleted successfully`);
      onClose();
    },
    onError: (error: any) => {
      const message = error.message || "Failed to delete branch";
      toast.error(message);
    },
  });

  const handleDelete = async () => {
    if (!branch) return;
    await deleteMutation.mutateAsync();
  };

  if (!isOpen || !branch) return null;

  const isMainBranch = branch.isMain;
  const canDelete = !isMainBranch; // Simplificado por ahora

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Delete Branch
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This action cannot be undone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            disabled={deleteMutation.isPending}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isMainBranch && (
            <div className="mb-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Cannot delete main branch
                </p>
              </div>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                You cannot delete the main branch while other branches exist.
              </p>
            </div>
          )}

          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Are you sure you want to delete the branch{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                "{branch.name}"
              </span>
              ?
            </p>

            {/* Branch info */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Code:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {branch.code}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Type:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {branch.typeDisplayName}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Address:
                </span>
                <span className="font-medium text-gray-900 dark:text-white truncate ml-2">
                  {branch.address}
                </span>
              </div>
              {branch.manager && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Manager:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {branch.manager.fullName}
                  </span>
                </div>
              )}
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                Warning: This will permanently remove the branch and all
                associated data.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={deleteMutation.isPending}
            className="px-6"
          >
            Cancel
          </Button>

          <Button
            onClick={handleDelete}
            loading={deleteMutation.isPending}
            disabled={!canDelete}
            className={`px-6 ${
              canDelete
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Delete Branch
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBranchModal;
