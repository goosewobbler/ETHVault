"use client"

import { Button } from "@/components/ui/button"

type CreateNoteButtonProps = {
    onClick: () => void
}

export function CreateNoteButton({ onClick }: CreateNoteButtonProps) {
    return (
        <div className="mt-8">
            <Button onClick={onClick}>Create Note</Button>
        </div>
    )
}

