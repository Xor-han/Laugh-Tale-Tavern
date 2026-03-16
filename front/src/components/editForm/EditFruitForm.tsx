import { useState } from "react";
import type { DevilFruit } from "../../interfaces/devilFruit.interface";

interface Props {
    devilFruit : DevilFruit
    onSubmit: (id: number, data: { name: string; imageId:number | null; typeId: number | null }) => void;
    onClose: () => void;
}

const EditFruitForm = ({devilFruit, onSubmit, onClose}: Props) => {

    const [name, setName] = useState(devilFruit.name || "");
    const [imageId, setImageId] = useState<number | null>(devilFruit.imageId);
    const [typeId, setTypeId] = useState<number | null>(devilFruit.typeId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        onSubmit(devilFruit.id, {
            name: name.trim(),
            typeId: typeId,
            imageId: imageId,
        });
    };

    return (
        <>
        </>
    )
}