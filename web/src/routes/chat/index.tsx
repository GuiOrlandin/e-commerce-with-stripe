import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChatProduct,
  ChatRequestError,
  useChat,
} from "../../hooks/useChat";
import { chatStore } from "../../store/chatStore";
import { Product, productStore } from "../../store/productStore";
import { userStore } from "../../store/userStore";
import {
  AddToCartButton,
  ChatHeader,
  ChatPageContainer,
  EmptyState,
  ErrorMessage,
  GoToCartLink,
  InputArea,
  MessageBubble,
  MessageInput,
  MessagesArea,
  ProductActions,
  ProductCard,
  ProductInfo,
  ProductsGrid,
  SendButton,
} from "./styles";

function toStoreProduct(product: ChatProduct): Product {
  const imageFilename = product.image_url.startsWith("/files/")
    ? product.image_url.slice("/files/".length)
    : product.image_url;

  return {
    _id: product.id,
    name: product.name,
    description: product.description ?? "",
    image_url: imageFilename,
    unit_value: product.unit_value,
    stock: product.stock,
    category: product.category,
    quantity: 1,
  };
}

function productImageSrc(imageUrl: string) {
  if (imageUrl.startsWith("http")) return imageUrl;
  if (imageUrl.startsWith("/files/")) {
    return `http://localhost:3333${imageUrl}`;
  }
  return `http://localhost:3333/files/${imageUrl}`;
}

export default function Chat() {
  const [input, setInput] = useState("");
  const messages = chatStore((state) => state.messages);
  const conversationId = chatStore((state) => state.conversationId);
  const appendMessage = chatStore((state) => state.appendMessage);
  const setConversationId = chatStore((state) => state.setConversationId);
  const { mutate, isPending, isError, error } = useChat();
  const setProduct = productStore((state) => state.setProduct);
  const user = userStore((state) => state.user);
  const isLoggedIn = Boolean(user?.token);

  const errorMessage =
    error instanceof ChatRequestError
      ? error.message
      : "Não foi possível enviar a mensagem. Verifique se a API e o Ollama estão rodando.";

  function handleAddToCart(product: ChatProduct) {
    setProduct(toStoreProduct(product));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const message = input.trim();
    if (!message || isPending || !isLoggedIn) return;

    appendMessage({ role: "user", content: message });
    setInput("");

    mutate(
      { message, conversationId },
      {
        onSuccess: (data) => {
          setConversationId(data.conversationId);
          appendMessage({
            role: "assistant",
            content: data.reply,
            products: data.products,
          });
        },
      },
    );
  }

  return (
    <ChatPageContainer>
      <ChatHeader>
        <h1>Assistente de compras</h1>
        <p>Descreva o que procura e receba sugestões da loja.</p>
      </ChatHeader>

      {!isLoggedIn && (
        <ErrorMessage>
          Faça <Link to="/login">login</Link> para usar o chat (controle de uso
          por usuário).
        </ErrorMessage>
      )}

      <MessagesArea>
        {messages.length === 0 ? (
          <EmptyState>
            Exemplo: &quot;tênis de corrida vermelho&quot; ou &quot;camiseta
            esportiva&quot;
          </EmptyState>
        ) : (
          messages.map((msg, index) => (
            <div key={index}>
              <MessageBubble $role={msg.role}>{msg.content}</MessageBubble>
              {msg.role === "assistant" &&
                msg.products &&
                msg.products.length > 0 && (
                  <ProductsGrid>
                    {msg.products.map((product) => (
                      <ProductCard key={product.id}>
                        <img
                          src={productImageSrc(product.image_url)}
                          alt={product.name}
                        />
                        <ProductInfo>
                          <h3>{product.name}</h3>
                          <p>{product.description}</p>
                          <span>
                            {product.unit_value.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </ProductInfo>
                        <ProductActions>
                          <AddToCartButton
                            type="button"
                            disabled={!user?.token}
                            onClick={() => handleAddToCart(product)}
                          >
                            Adicionar ao carrinho
                          </AddToCartButton>
                        </ProductActions>
                      </ProductCard>
                    ))}
                    <GoToCartLink as={Link} to="/cart">
                      Ir ao carrinho →
                    </GoToCartLink>
                  </ProductsGrid>
                )}
            </div>
          ))
        )}
      </MessagesArea>

      {isError && <ErrorMessage>{errorMessage}</ErrorMessage>}

      <InputArea onSubmit={handleSubmit}>
        <MessageInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Descreva o produto que procura..."
          disabled={isPending || !isLoggedIn}
          rows={2}
        />
        <SendButton
          type="submit"
          disabled={isPending || !isLoggedIn || !input.trim()}
        >
          {isPending ? "Enviando..." : "Enviar"}
        </SendButton>
      </InputArea>
    </ChatPageContainer>
  );
}
