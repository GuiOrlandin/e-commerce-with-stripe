import { UserWithPurchasedProductsResponse } from "../routes/myPurchase";
import { chatStore } from "./chatStore";
import { userStore } from "./userStore";

const userA: UserWithPurchasedProductsResponse = {
  id: "user-a",
  email: "a@example.com",
  name: "A",
  role: "USER",
  token: "token-a",
  profile_picture: "",
  phone_number: "",
  purchasedProducts: [],
};

const userB = {
  ...userA,
  id: "user-b",
  email: "b@example.com",
  name: "B",
  token: "token-b",
};

describe("userStore chat isolation", () => {
  beforeEach(() => {
    chatStore.getState().clearChat();
    userStore.getState().clearUser();
  });

  it("clears chat on logout", () => {
    userStore.getState().setUser(userA);
    chatStore.getState().appendMessage({ role: "user", content: "oi" });
    chatStore.getState().setConversationId("conv-1");

    userStore.getState().clearUser();

    expect(chatStore.getState().messages).toEqual([]);
    expect(chatStore.getState().conversationId).toBeUndefined();
  });

  it("clears chat when switching to another user without logout", () => {
    userStore.getState().setUser(userA);
    chatStore.getState().appendMessage({ role: "user", content: "oi" });
    chatStore.getState().setConversationId("conv-1");

    userStore.getState().setUser(userB);

    expect(chatStore.getState().messages).toEqual([]);
    expect(chatStore.getState().conversationId).toBeUndefined();
  });
});
