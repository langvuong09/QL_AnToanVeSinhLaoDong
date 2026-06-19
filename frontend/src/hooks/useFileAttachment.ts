'use client'

import { useCallback, useRef, useState } from 'react'
import { Media } from '@/src/api/Media'
import type { AttachmentGroup, UploadedFile } from '@/src/components/modals/EnterpriseStepOne'
import type { AttachmentGroupMock } from '@/src/mocks/enterprises'

// ── Constants ──────────────────────────────────────────────────────────
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]
const ALLOWED_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png', 'webp']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB
const MAX_FILES_PER_GROUP = 1

const DEFAULT_GROUPS: AttachmentGroup[] = [
  { groupName: 'Giấy phép kinh doanh', fileType: 'GPKD', files: [] },
  { groupName: 'Giấy tờ khác', fileType: 'OTHER', files: [] },
]

// ── Helpers ────────────────────────────────────────────────────────────

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function validateFile(file: File): string {
  const ext = file.name.split('.').pop()?.toLowerCase() || ''
  const isAllowedExt = ALLOWED_EXTENSIONS.includes(ext)
  const isAllowedMime = ALLOWED_MIME_TYPES.includes(file.type)

  if (!isAllowedMime && !isAllowedExt) {
    return 'Chỉ cho phép tải lên các định dạng: PDF (.pdf) hoặc Hình ảnh (.jpg, .jpeg, .png, .webp)'
  }

  if (file.size > MAX_FILE_SIZE) return 'File không được vượt quá 10MB'
  return ''
}

/** Revoke tất cả blob URL trong 1 group để tránh memory leak */
function revokeBlobUrls(groups: AttachmentGroup[]) {
  for (const group of groups) {
    for (const file of group.files) {
      if (file.url && file.file && file.url.startsWith('blob:')) {
        URL.revokeObjectURL(file.url)
      }
    }
  }
}

// ── Hook ───────────────────────────────────────────────────────────────

export function useFileAttachment() {
  const [attachmentGroups, setAttachmentGroups] = useState<AttachmentGroup[]>(
    DEFAULT_GROUPS.map((g) => ({ ...g, files: [] })),
  )
  const nextFileIdRef = useRef(1)

  // Keep latest attachmentGroups in a ref for synchronous access in addFiles
  const attachmentGroupsRef = useRef<AttachmentGroup[]>(attachmentGroups)
  attachmentGroupsRef.current = attachmentGroups

  // ── removeFile ─────────────────────────────────────────────────────
  const removeFile = useCallback(
    async (groupIndex: number, fileId: number | string) => {
      // Tìm file target trước khi xóa
      const targetGroup = attachmentGroupsRef.current[groupIndex]
      const targetFile = targetGroup?.files.find((f) => f.id === fileId)

      // Nếu là file đã lưu trên server (id là string, không có f.file), gọi API xóa
      if (typeof fileId === 'string' && targetFile && !targetFile.file) {
        const media = new Media()
        const result = await media.deleteFile(fileId)
        if (!result.success) {
          return { success: false, message: result.message }
        }
      }

      // Revoke blob URL nếu có (local file)
      if (targetFile?.url && targetFile.file && targetFile.url.startsWith('blob:')) {
        URL.revokeObjectURL(targetFile.url)
      }

      // Xóa file khỏi state
      setAttachmentGroups((prev) =>
        prev.map((group, idx) =>
          idx === groupIndex
            ? { ...group, files: group.files.filter((f) => f.id !== fileId) }
            : group,
        ),
      )

      return { success: true }
    },
    [],
  )

  // ── addFiles ───────────────────────────────────────────────────────
  const addFiles = useCallback(
    async (groupIndex: number, fileList: FileList) => {
      const currentGroups = attachmentGroupsRef.current
      const targetGroup = currentGroups[groupIndex]
      if (!targetGroup) return { success: false, error: 'Nhóm file không hợp lệ' }

      const file = fileList[0]
      if (!file) return { success: false }

      const error = validateFile(file)
      if (error) {
        return { success: false, error }
      }

      // Tự động thay thế file cũ: Xóa file cũ nếu có trước khi thêm mới
      const oldFile = targetGroup.files[0]
      if (oldFile) {
        const removeRes = await removeFile(groupIndex, oldFile.id)
        if (!removeRes.success) {
          return { success: false, error: removeRes.message || 'Không thể thay thế file cũ' }
        }
      }

      const id = nextFileIdRef.current++
      const newFile: UploadedFile = {
        id,
        name: file.name,
        size: formatFileSize(file.size),
        file,
        url: URL.createObjectURL(file),
        mimeType: file.type,
        fileType: targetGroup.fileType,
      }

      setAttachmentGroups((prev) =>
        prev.map((group, idx) =>
          idx === groupIndex ? { ...group, files: [newFile] } : group,
        ),
      )

      return { success: true }
    },
    [removeFile],
  )

  // ── resetAttachments ───────────────────────────────────────────────
  const resetAttachments = useCallback(() => {
    // Revoke tất cả blob URLs trước khi reset
    setAttachmentGroups((prev) => {
      revokeBlobUrls(prev)
      return DEFAULT_GROUPS.map((g) => ({ ...g, files: [] }))
    })
    nextFileIdRef.current = 1
  }, [])

  // ── initFromServer (edit mode) ─────────────────────────────────────
  const initFromServer = useCallback((serverData: AttachmentGroupMock[] | undefined) => {
    // Revoke blob URLs cũ trước
    setAttachmentGroups((prev) => {
      revokeBlobUrls(prev)
      return DEFAULT_GROUPS.map((group) => ({
        ...group,
        files:
          serverData
            ?.find((item) => item.fileType === group.fileType || item.groupName === group.groupName)
            ?.files.map((file) => ({
              id: file.id,
              name: file.name,
              size: file.size,
              url: file.url,
              fileType: group.fileType,
            })) || [],
      }))
    })
    // Reset ID counter cao hơn để tránh conflict với server file IDs
    nextFileIdRef.current = 1
  }, [])

  // ── Computed values ────────────────────────────────────────────────
  const hasErrors = attachmentGroups.some((group) => group.files.some((f) => f.error))

  const pendingFileCount = attachmentGroups.reduce(
    (count, group) => count + group.files.filter((f) => f.file).length,
    0,
  )

  return {
    attachmentGroups,
    addFiles,
    removeFile,
    resetAttachments,
    initFromServer,
    hasErrors,
    pendingFileCount,
  }
}
