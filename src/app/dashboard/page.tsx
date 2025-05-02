'use client'

import {useState} from "react";
import {Button} from "@/components/ui/button";

export default function DashboardPage() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <Button  onClick={() => {
                setCount(prev => {
                    const next = prev + 1;
                    console.log(next);
                    return next;
                });
            }}>Easy</Button>
        </div>
    );
}