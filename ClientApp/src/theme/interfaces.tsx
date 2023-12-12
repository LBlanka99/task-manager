export interface User {
    id: string;
    userName: string;
    email: string | null;
    password: string;
    profilPicture: string | null;
    roles: string[];
};

export interface Tag {
    id: string;
    name: string;
    color: string;
}

export interface Task {
    id: string;
    title: string;
    deadline: Date;
    assignees: User[];
    points: Number;
    tags: Tag[];
    description: string | null;
    status: Number;
    confirmingPhoto: string | null;
}

export interface Group {
    id: string;
    name: string;
    members: User[];
    tags: Tag[];
    tasks: Task[];

}