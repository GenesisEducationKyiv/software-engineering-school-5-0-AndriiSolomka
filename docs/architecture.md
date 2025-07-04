```mermaid
graph TB
    %% Core Layer - innermost layer
    subgraph Core["Core Layer"]
        Entities["Entities"]
        Abstracts["Interfaces"]
    end

    %% Use Cases Layer
    subgraph UseCases["Use Cases Layer"]
        UC["Use Cases"]
    end

    %% Interface Layer
    subgraph Interface["Interface Layer"]
        Controllers["Controllers"]
        DTOs["DTOs"]
        InterfaceModules["Interface Modules"]
    end

    %% Infrastructure Layer
    subgraph Infrastructure["Infrastructure Layer"]
        Repos["Repositories"]
        Services["Services"]
        Proxies["Proxies"]
    end

    %% Application Layer
    subgraph Application["Application Layer"]
        AppModules["Application Modules"]
        Factories["Factories"]
    end

    %% Dependencies - keeping original arrows between layers
    Interface --> UseCases
    Interface --> Application
    UseCases --> Core
    Infrastructure --> Core
    Application --> UseCases
    Application --> Infrastructure