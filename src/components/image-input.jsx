import React, {useCallback, useState, useTransition} from "react";
import {useDropzone} from 'react-dropzone';
import {Loader2, Trash2, FilePenLine} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";

export default function ImageInput ({value, onChange, disabled, disableRemove, uploader}) {
    const [preview, setPreview] = useState(null);
    const [uploadError, setUploadError] = useState(null); // Error state
    const [uploading, startTransition] = useTransition();
    const onDrop = useCallback( (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            setUploadError(null);
            startTransition(async () => {
                try {
                    const {cdnUrl} = await uploader(file);
                    onChange?.(cdnUrl);
                    setPreview(null);
                } catch (error) {
                    console.log(error);
                    setUploadError(error.message || error.errMsg);
                }
            });
        }
    }, [onChange, uploader]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg', '.webp'],
            'image/gif': ['.gif'],
        },
        maxFiles: 1,
    });

    const removeImage = (e) => {
        e.stopPropagation();
        setPreview(null);
        setUploadError(null);
        onChange?.(null);
    };

    return (
        <div
            {...getRootProps({
                className: `relative flex items-center justify-center w-32 h-32 cursor-pointer border ${isDragActive ? "border-red" : ""}`,
            })}
        >
            <input {...getInputProps()} disabled={disabled}/>
            {(preview || value) && (
                <img
                    src={preview || value}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                />)
            }
            {uploading && (
                <div className="absolute w-6 h-6 p-1 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white rounded">
                    <Loader2 className="w-full h-full animate-spin"/>
                </div>
            )}
            {!uploading && !value && (
                <div className="absolute w-6 h-6 p-1 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-foreground bg-secondary rounded">
                    <FilePenLine className="w-full h-full"/>
                </div>
            )}
            {!uploading && value && !disableRemove && (
                <Button type="button" variant="outline" className="absolute right-1 top-1 w-6 h-6 p-1" onClick={removeImage} disabled={disabled}>
                    <Trash2/>
                </Button>
            )}
            {uploadError && (
                <div className="absolute left-0 top-0 bottom-0 right-0 text-destructive">
                    Error
                </div>
            )}
        </div>
    );
};
