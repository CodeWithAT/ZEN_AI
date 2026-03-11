export declare const notificationService: {
    createAndSend: (userId: string, type: string, title: string, message: string, link?: string) => Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        type: string;
        link: string | null;
        message: string;
        title: string;
        read: boolean;
    } | undefined>;
};
//# sourceMappingURL=notificationService.d.ts.map