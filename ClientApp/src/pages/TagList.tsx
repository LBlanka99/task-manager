import { IonAlert, IonButton, IonButtons, IonChip, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonMenuButton, IonModal, IonPage, IonRow, IonTitle, IonToolbar } from "@ionic/react";
import "./TagList.css";
import { Group, Tag } from "../theme/interfaces";
import { add, addCircleOutline, addCircleSharp, pencil, pencilOutline, pencilSharp, trash, trashOutline, trashSharp } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { getContrastColor } from "../theme/colorUtils";
import { baseUrl } from "../theme/variables";

interface TagListPageProps {
    group: Group | undefined;
}

const TagListPage: React.FC<TagListPageProps> = ({ group }) => {
    const [tags, setTags] = useState<Tag[]>(group?.tags ?? []);
    const [sortedTags, setSortedTags] = useState<Tag[]>([]);
    const [editingTag, setEditingTag] = useState<Tag | null>(null);
    const [newTagName, setNewTagName] = useState("");
    const [newTagColor, setNewTagColor] = useState("#FA8072");
    const [editingTagName, setEditingTagName] = useState(editingTag?.name);
    const [editingTagColor, setEditingTagColor] = useState(editingTag?.color);
    const [deletingTag, setDeletingTag] = useState<Tag | null>(null);

    const createModal = useRef<HTMLIonModalElement>(null);

    useEffect(() => {
        if (group?.tags) {
            setTags(group.tags);
            setSortedTags([...group.tags].sort((a, b) => (a.name.length > b.name.length) ? 1 : -1));
        }
    }, [group]);

    useEffect(() => {
        setSortedTags([...tags].sort((a, b) => (a.name.length > b.name.length) ? 1 : -1));
    }, [tags]);

    useEffect(() => {
        if (editingTag) {
            setEditingTagName(editingTag.name);
            setEditingTagColor(editingTag.color);
        }
    }, [editingTag]);


    const handleDeleteTag = async () => {
        const apiAddress = `${baseUrl}tags/${deletingTag?.id}`;

        const init: RequestInit = {
            method: "DELETE",
            credentials: "include",
            headers: new Headers([["content-type", "application/json"]]),
        }
        const response = await fetch(apiAddress, init);

        setTags((prevTags) => prevTags.filter((tag) => tag.id !== deletingTag?.id));

        setDeletingTag(null);
    }

    const handleSaveEdit = async (e: any) => {
        e.preventDefault();
        const apiAddress = `${baseUrl}tags/${editingTag?.id}`;

        const updatedTag = {
            "name": editingTagName,
            "color": editingTagColor,
        };

        const init: RequestInit = {
            method: "PUT",
            credentials: "include",
            headers: new Headers([["content-type", "application/json"]]),
            body: JSON.stringify(updatedTag),
        };

        const response = await fetch(apiAddress, init);
        const responseTag = await response.json();

        setTags((prevTags) =>
            prevTags.map((tag) => (tag.id === editingTag?.id ? { ...responseTag } : tag))
        );

        setEditingTag(null);
    };

    const handleCreateTag = async (e: any) => {
        e.preventDefault();

        const apiAddress = `${baseUrl}tags/${group?.id}/new-tag`;

        const newTag = {
            "name": newTagName,
            "color": newTagColor
        };

        const init: RequestInit = {
            method: "POST",
            credentials: "include",
            headers: new Headers([["content-type", "application/json"]]),
            body: JSON.stringify(newTag),
        };
        const response = await fetch(apiAddress, init);
        const responseTag = await response.json();


        setTags((prevTags) => [...prevTags, responseTag]);

        setNewTagName("");
        setNewTagColor("#FA8072");

        createModal.current?.dismiss();
    };


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Címkék</IonTitle>
                </IonToolbar>
            </IonHeader>
            {group ?
                <IonContent class="ion-padding">

                    <IonList>
                        {sortedTags.map((tag, index) => (
                            <IonChip key={index} className="border-chip" style={{ backgroundColor: tag.color, color: getContrastColor(tag.color) }}>
                                <p className="ion-no-margin ion-margin-end" style={{ fontSize: "20px" }}>{tag.name}</p>

                                <IonButton className="ion-no-padding" aria-label="edit" fill="clear" onClick={() => setEditingTag(tag)} style={{ padding: "0px" }}>
                                    <IonIcon slot="icon-only" aria-hidden ios={pencilOutline} md={pencilSharp} style={{ color: getContrastColor(tag.color)}} />
                                </IonButton>
                                <IonButton className="ion-no-padding" aria-label="delete" fill="clear" onClick={() => setDeletingTag(tag)} style={{ padding: "0px" }}>
                                    <IonIcon slot="icon-only"  aria-hidden ios={trashOutline} md={trashSharp} style={{ color: getContrastColor(tag.color)}} />
                                </IonButton>
                            </IonChip>
                        ))}
                    </IonList>

                    <IonFab slot="fixed" vertical="bottom" horizontal="end" class="ion-margin">
                        <IonFabButton id="open-new-tag-dialog" aria-label="new-tag" color={"primary"}>
                            <IonIcon icon={add}></IonIcon>
                        </IonFabButton>
                    </IonFab>


                    <IonModal className="modal" id="new-tag-modal" trigger="open-new-tag-dialog" ref={createModal}>
                        <IonContent scrollY={false}>
                            <IonToolbar>
                                <IonButtons slot="start">
                                    <IonButton color="primary" onClick={() => createModal.current?.dismiss()}>
                                        Mégsem
                                    </IonButton>
                                </IonButtons>
                                <IonTitle>Új címke</IonTitle>
                                <IonButtons slot="end">
                                    <IonButton color="primary" type="submit" form="new-tag-form">
                                        Létrehozás
                                    </IonButton>
                                </IonButtons>
                            </IonToolbar>
                            <form id="new-tag-form" onSubmit={handleCreateTag}>
                                <IonList>
                                    <IonItem style={{ marginTop: "15px" }}>
                                        <IonInput
                                            label="Címke neve"
                                            placeholder="Ide írd a címke nevét"
                                            value={newTagName}
                                            clearInput
                                            onIonInput={(i) => setNewTagName(i.detail.value!)}
                                            required
                                        />
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel>Címke színe</IonLabel>
                                        <input
                                            type="color"
                                            value={newTagColor}
                                            onChange={(i) => setNewTagColor(i.target.value)}
                                        />
                                    </IonItem>
                                </IonList>
                            </form>
                        </IonContent>
                    </IonModal>

                    <IonModal className="modal" id="update-tag-modal" isOpen={editingTag != null} backdropDismiss onDidDismiss={() => setEditingTag(null)}>
                        <IonContent scrollY={false}>
                            <IonToolbar>
                                <IonButtons slot="start">
                                    <IonButton color="primary" onClick={() => setEditingTag(null)}>
                                        Mégsem
                                    </IonButton>
                                </IonButtons>
                                <IonTitle class="ion-text-center">Szerkesztés</IonTitle>
                                <IonButtons slot="end">
                                    <IonButton color="primary" type="submit" form="update-tag-form">
                                        Mentés
                                    </IonButton>
                                </IonButtons>
                            </IonToolbar>
                            <form id="update-tag-form" onSubmit={handleSaveEdit}>
                                <IonList>
                                    <IonItem style={{ marginTop: "15px" }}>
                                        <IonInput
                                            label="Címke neve"
                                            value={editingTagName}
                                            clearInput
                                            onIonInput={(i) => setEditingTagName(i.detail.value!)}
                                            required
                                        />
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel>Címke színe</IonLabel>
                                        <input
                                            type="color"
                                            value={editingTagColor}
                                            onChange={(i) => setEditingTagColor(i.target.value!)}
                                        />
                                    </IonItem>
                                </IonList>
                            </form>
                        </IonContent>
                    </IonModal>

                    <IonAlert
                        isOpen={deletingTag != null}
                        onDidDismiss={() => setDeletingTag(null)}
                        header={"Törlés megerősítése"}
                        message={"Biztos vagy benne, hogy törölni szeretnéd ezt a címkét?"}
                        buttons={[
                            {
                                text: "Mégsem",
                                role: "cancel",
                                handler: () => {
                                    setDeletingTag(null);
                                }
                            },
                            {
                                text: "Törlés",
                                role: "confirm",
                                handler: handleDeleteTag
                            },
                        ]}
                    />
                </IonContent>
                :
                <div></div>
            }


        </IonPage>
    );
};

export default TagListPage;