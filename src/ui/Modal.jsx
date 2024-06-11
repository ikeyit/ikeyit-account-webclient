import React, {useState} from 'react';
import './Modal.css';
import ReactDOM from "react-dom";

export function Modal({show = false, title="", onCancel = ()=>{}, children}) {
    if (show) {
        return ReactDOM.createPortal(
            <div className="modal-overlay">
                <div className="modal">
                    <div className="modal-header">
                        <div className="modal-title">
                            {title}
                        </div>
                        <button className="modal-close-button" onClick={onCancel}>X</button>
                    </div>
                    <div className="modal-content">
                        {children}
                    </div>
                </div>
            </div>,
            document.body
        );
    }
    return null;
}
