import {
  useSupabaseUpload,
  type UseSupabaseUploadOptions,
  type UseSupabaseUploadReturn,
} from "@/hooks/use-supabase-upload"
import { Slot } from "@radix-ui/react-slot"
import {
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react"

type UploadResult = {
  files: UseSupabaseUploadReturn["files"]
  successes: UseSupabaseUploadReturn["successes"]
  errors: UseSupabaseUploadReturn["errors"]
}

export type SupabaseUploadTriggerRenderProps = {
  open: () => void
  upload: () => Promise<void>
  reset: () => void
} & Pick<
  UseSupabaseUploadReturn,
  "files" | "loading" | "errors" | "successes"
>

export type SupabaseUploadTriggerProps = {
  options: UseSupabaseUploadOptions
  children:
    | ReactNode
    | ((props: SupabaseUploadTriggerRenderProps) => ReactNode)
  asChild?: boolean
  autoUpload?: boolean
  disabled?: boolean
  onFilesChange?: (files: UseSupabaseUploadReturn["files"]) => void
  onUploadStart?: (files: UseSupabaseUploadReturn["files"]) => void
  onUploadComplete?: (result: UploadResult) => void
  onUploadSuccess?: (successes: UseSupabaseUploadReturn["successes"]) => void
  onUploadError?: (errors: UseSupabaseUploadReturn["errors"]) => void
}

export type SupabaseUploadTriggerHandle = SupabaseUploadTriggerRenderProps & {
  setFiles: UseSupabaseUploadReturn["setFiles"]
  setErrors: UseSupabaseUploadReturn["setErrors"]
  setSuccesses: UseSupabaseUploadReturn["setSuccesses"]
}

/**
 * High-level trigger component around `useSupabaseUpload` that lets you wrap any UI (buttons, avatars, etc.)
 * and handle Supabase Storage uploads. Provides callbacks for reacting to lifecycle events and optional
 * render props for accessing upload state.
 */
export const SupabaseUploadTrigger = forwardRef<
  SupabaseUploadTriggerHandle,
  SupabaseUploadTriggerProps
>(
  (
    {
      options,
      children,
      asChild = false,
      autoUpload = false,
      disabled = false,
      onFilesChange,
      onUploadStart,
      onUploadComplete,
      onUploadError,
      onUploadSuccess,
    },
    ref
  ) => {
    const {
      files,
      setFiles,
      setErrors,
      setSuccesses,
      errors,
      successes,
      loading,
      onUpload,
      getInputProps,
      open,
    } = useSupabaseUpload(options)

    const previousLoadingRef = useRef<boolean>(loading)
    const previousFilesLengthRef = useRef<number>(files.length)

    const handleOpen = useCallback(() => {
      if (disabled) {
        return
      }
      open()
    }, [disabled, open])

    const handleUpload = useCallback(async () => {
      if (disabled || files.length === 0) {
        return
      }
      onUploadStart?.(files)
      await onUpload()
    }, [disabled, files, onUpload, onUploadStart])

    const reset = useCallback(() => {
      setFiles([])
      setErrors([])
      setSuccesses([])
    }, [setFiles, setErrors, setSuccesses])

    const renderProps = useMemo(
      () => ({
        open: handleOpen,
        upload: handleUpload,
        reset,
        files,
        errors,
        successes,
        loading,
      }),
      [handleOpen, handleUpload, reset, files, errors, successes, loading]
    )

    useImperativeHandle(
      ref,
      () => ({
        ...renderProps,
        setFiles,
        setErrors,
        setSuccesses,
      }),
      [renderProps, setErrors, setFiles, setSuccesses]
    )

    useEffect(() => {
      if (!onFilesChange) return
      onFilesChange(files)
    }, [files, onFilesChange])

    useEffect(() => {
      if (!autoUpload) {
        previousFilesLengthRef.current = files.length
        return
      }

      if (files.length > previousFilesLengthRef.current) {
        void handleUpload()
      }

      previousFilesLengthRef.current = files.length
    }, [autoUpload, files.length, handleUpload])

    useEffect(() => {
      if (!previousLoadingRef.current || loading) {
        previousLoadingRef.current = loading
        return
      }

      onUploadSuccess?.(successes)
      onUploadError?.(errors)
      onUploadComplete?.({ files, successes, errors })

      previousLoadingRef.current = loading
    }, [loading, files, successes, errors, onUploadComplete, onUploadError, onUploadSuccess])

    const inputProps = getInputProps({
      style: { display: "none" },
      disabled,
    })

    const content = useMemo(() => {
      if (typeof children === "function") {
        return children(renderProps)
      }

      if (isValidElement(children)) {
        const child = children as ReactElement
        const mergedOnClick = (event: MouseEvent<HTMLElement>) => {
          // Preserve consumer's onClick
          if (typeof child.props.onClick === "function") {
            child.props.onClick(event)
          }

          if (event.defaultPrevented) return
          handleOpen()
        }

        if (asChild) {
          return (
            <Slot
              {...child.props}
              onClick={mergedOnClick}
              data-upload-loading={loading ? "" : undefined}
              aria-busy={loading || undefined}
            >
              {child.props.children}
            </Slot>
          )
        }

        return cloneElement(child, {
          onClick: mergedOnClick,
          "data-upload-loading": loading ? "" : undefined,
          "aria-busy": loading || undefined,
        })
      }

      return children ?? null
    }, [asChild, children, handleOpen, loading, renderProps])

    return (
      <>
        {content}
        <input {...inputProps} />
      </>
    )
  }
)

SupabaseUploadTrigger.displayName = "SupabaseUploadTrigger"


