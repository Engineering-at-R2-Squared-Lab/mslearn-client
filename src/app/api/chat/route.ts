import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Create a new ReadableStream
    const stream = new ReadableStream({
      async start(controller) {
        // Get the last user message
        const lastUserMessage = messages.findLast(
          (message: any) => message.role === "user"
        );
        const userQuery = lastUserMessage?.content || "";

        // Example responses with code blocks for different types of queries
        let response = "";

        if (userQuery.toLowerCase().includes("azure")) {
          response = `Here's how you can create a virtual machine in Azure using Azure CLI:

\`\`\`bash
# Login to Azure
az login

# Create a resource group
az group create --name myResourceGroup --location eastus

# Create a VM
az vm create \\
  --resource-group myResourceGroup \\
  --name myVM \\
  --image Ubuntu2204 \\
  --admin-username azureuser \\
  --generate-ssh-keys
\`\`\`

You can also use Azure PowerShell:

\`\`\`powershell
# Login to Azure
Connect-AzAccount

# Create a resource group
New-AzResourceGroup -Name myResourceGroup -Location EastUS

# Create a VM
New-AzVM -ResourceGroupName myResourceGroup -Name myVM -Location EastUS -Image UbuntuLTS
\`\`\`

Would you like to know more about Azure VM options or pricing?`;
        } else if (
          userQuery.toLowerCase().includes("c#") ||
          userQuery.toLowerCase().includes("csharp")
        ) {
          response = `Here's a simple C# program that demonstrates dependency injection with .NET:

\`\`\`csharp
using Microsoft.Extensions.DependencyInjection;
using System;

namespace DependencyInjectionDemo
{
    public interface IGreetingService
    {
        string GetGreeting();
    }

    public class GreetingService : IGreetingService
    {
        public string GetGreeting() => "Hello from Microsoft Learn Copilot!";
    }

    class Program
    {
        static void Main(string[] args)
        {
            // Setup DI container
            var serviceProvider = new ServiceCollection()
                .AddSingleton<IGreetingService, GreetingService>()
                .BuildServiceProvider();

            // Resolve the service
            var greetingService = serviceProvider.GetService<IGreetingService>();
            
            // Use the service
            Console.WriteLine(greetingService.GetGreeting());
        }
    }
}
\`\`\`

This example shows how to:
1. Define an interface and implementation
2. Register the service in the DI container
3. Resolve and use the service

Would you like to learn more about dependency injection patterns in .NET?`;
        } else if (userQuery.toLowerCase().includes("power bi")) {
          response = `Here's how you can create a basic measure in Power BI using DAX:

\`\`\`dax
Total Sales = SUM(Sales[SalesAmount])

Profit Margin % = 
DIVIDE(
    SUM(Sales[Profit]),
    SUM(Sales[SalesAmount]),
    0
) * 100
\`\`\`

And here's how you can create a calculated column:

\`\`\`dax
Sales[Full Name] = Sales[First Name] & " " & Sales[Last Name]

Sales[Profit] = Sales[SalesAmount] - Sales[TotalCost]
\`\`\`

Would you like to learn about more advanced DAX functions or visualization techniques in Power BI?`;
        } else {
          response = `Welcome to Microsoft Learn Copilot! I can help you with various Microsoft technologies.

Here are some examples of what you can ask me about:

- Azure cloud services and deployment
- C# and .NET development
- Microsoft 365 applications and services
- Power Platform (Power BI, Power Apps, Power Automate)
- Windows development and administration

For example, I can show you how to create a simple React component with TypeScript:

\`\`\`tsx
import React, { useState } from 'react';

interface CounterProps {
  initialCount?: number;
}

export const Counter: React.FC<CounterProps> = ({ initialCount = 0 }) => {
  const [count, setCount] = useState(initialCount);

  return (
    <div className="counter">
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};
\`\`\`

What Microsoft technology would you like to learn about today?`;
        }

        // Stream the response word by word to simulate typing
        const words = response.split(" ");

        // Send the first event with an empty string to establish the connection
        controller.enqueue(encoder.encode(`data: \n\n`));

        for (let i = 0; i < words.length; i++) {
          const word = words[i];

          // Add a space after each word except the last one
          const chunk = i === words.length - 1 ? word : word + " ";

          // Format as SSE event
          controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));

          // Add a small delay to simulate typing
          await new Promise((resolve) => setTimeout(resolve, 50));
        }

        // Send a done event
        controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
        controller.close();
      },
    });

    const encoder = new TextEncoder();

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
