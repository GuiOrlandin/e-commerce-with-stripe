import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { ChatProduct, useChat } from "../../hooks/useChat";
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

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  products?: ChatProduct[];
};

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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const { mutate, isPending, isError } = useChat();
  const setProduct = productStore((state) => state.setProduct);
  const user = userStore((state) => state.user);

  function handleAddToCart(product: ChatProduct) {
    setProduct(toStoreProduct(product));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const message = input.trim();
    if (!message || isPending) return;

    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setInput("");

    mutate(message, {
      onSuccess: (data) => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.reply,
            products: data.products,
          },
        ]);
      },
    });
  }

  return (
    <ChatPageContainer>
      <ChatHeader>
        <h1>Assistente de compras</h1>
        <p>Descreva o que procura e receba sugestões da loja.</p>
      </ChatHeader>

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
              {msg.role === "assistant" && msg.products && msg.products.length > 0 && (
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

      {isError && (
        <ErrorMessage>
          Não foi possível enviar a mensagem. Verifique se a API e o Ollama estão
          rodando.
        </ErrorMessage>
      )}

      <InputArea onSubmit={handleSubmit}>
        <MessageInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Descreva o produto que procura..."
          disabled={isPending}
          rows={2}
        />
        <SendButton type="submit" disabled={isPending || !input.trim()}>
          {isPending ? "Enviando..." : "Enviar"}
        </SendButton>
      </InputArea>
    </ChatPageContainer>
  );
}
