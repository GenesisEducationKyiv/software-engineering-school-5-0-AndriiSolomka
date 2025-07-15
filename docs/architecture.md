```mermaid
graph TB
    subgraph BusinessLogic["Buisness rules"]
        style BusinessLogic fill:#e0e7ff,stroke:#333,stroke-width:2px

        subgraph UseCases["Use Cases"]
            UC["Use Cases"]
        end

        subgraph Infrastructure["Infrastructure"]
            Repos["Repositories"]
            Services["Services"]
            Proxies["Proxies"]
        end

        subgraph Application["Application"]
            AppModules["Application Modules"]
            Factories["Factories"]
        end
    end

    subgraph Core["Core Layer"]
        Entities["Entities"]
        Abstracts["Interfaces"]
    end

    subgraph Interface["Interface Layer"]
        Controllers["Controllers"]
        DTOs["DTOs"]
        InterfaceModules["Interface Modules"]
    end

    Interface --> Application
    Application --> UseCases
    Application --> Infrastructure
    UseCases --> Core
    Infrastructure --> Core