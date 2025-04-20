import React from 'react';
import { LoaderCircle } from 'lucide-react';

export default function LoadingScreen() {
    return <>
        <div className="h-screen flex items-center justify-center">
            <LoaderCircle className="w-30 h-30 text-secondary-400 animate-spin"/>
        </div>
    </>

}