import { before } from "@vendetta/patcher";
import { FluxDispatcher } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";

export function msgSuccess() {
    return before(
        "actionHandler",
        FluxDispatcher._actionHandlers
            ._computeOrderedActionHandlers("LOAD_MESSAGES_SUCCESS")
            .find(i => i.name === "MessageStore"),
        (args) => {
            if (!storage.allAsVM) return;

            args[0].messages.forEach(message => {
                if (message.flags === 8192) return;

                message.attachments?.forEach(att => {
                    if (att.content_type?.startsWith("audio")) {
                        message.flags |= 8192;
                    }
                });
            });
        }
    );
}

export function msgCreate() {
    return before(
        "actionHandler",
        FluxDispatcher._actionHandlers
            ._computeOrderedActionHandlers("MESSAGE_CREATE")
            .find(i => i.name === "MessageStore"),
        (args) => {
            const msg = args[0].message;
            if (!storage.allAsVM || msg.flags === 8192) return;

            if (msg.attachments?.[0]?.content_type?.startsWith("audio")) {
                msg.flags |= 8192;
            }
        }
    );
}

export function msgUpdate() {
    return before(
        "actionHandler",
        FluxDispatcher._actionHandlers
            ._computeOrderedActionHandlers("MESSAGE_UPDATE")
            .find(i => i.name === "MessageStore"),
        (args) => {
            const msg = args[0].message;
            if (!storage.allAsVM || msg.flags === 8192) return;

            if (msg.attachments?.[0]?.content_type?.startsWith("audio")) {
                msg.flags |= 8192;
            }
        }
    );
}
