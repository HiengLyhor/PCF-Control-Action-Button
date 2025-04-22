import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class SyncActionButton implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private _context: ComponentFramework.Context<IInputs>;
    private _container: HTMLDivElement;
    private _button: HTMLButtonElement;
    private _notifyOutputChanged: () => void;

    private currentValue: string | null;
    private buttonColor: string;
    private buttonText: string;

    constructor() {
        // Initialize variables
    }

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {

        this._context = context;
        this._container = container;
        this._notifyOutputChanged = notifyOutputChanged;

        // Set color code for each option in the dropdown
        switch (context.parameters.ButtonColor.raw) {
            case "1": // Red
                this.buttonColor = "#FDBDBD";
                break;
            case "2": // Green
                this.buttonColor = "#DBFBDB";
                break;
            case "3": // Blue
                this.buttonColor = "#BFD9FB";
                break;
            case "4": // Orange
                this.buttonColor = "#FDBD98";
                break;
            default:
                this.buttonColor = this._context.parameters.ColorCode.raw || "#DBFBDB";
        }

        // Button text
        this.buttonText = this._context.parameters.ButtonText.raw || "Click Me";

        // Create button element
        this._button = document.createElement("button");
        this._button.innerText = this.buttonText;
        this._button.classList.add('button');

        // Generate color palette based on the selected color
        const colorPalette = this.generateColorPalette(this.buttonColor);

        // Set button styles using the generated color palette
        this._button.style.backgroundColor = this.buttonColor;  // Background color
        this._button.style.border = `1px solid ${colorPalette['Border Color']}`; // Border color
        this._button.style.color = colorPalette['Text Color'];  // Text color
        this._button.style.width = this._context.parameters.ButtonWidth.raw?.toString() + "%" || "100%"; // Button width

        // Hover styles
        this._button.addEventListener("mouseenter", () => {
            this._button.style.backgroundColor = colorPalette['Background Hover Color'];
            this._button.style.borderColor = colorPalette['Border Color Hover'];
            this._button.style.color = colorPalette['Text Color Hover'];
        });

        // Pressed styles
        this._button.addEventListener("mousedown", () => {
            this._button.style.backgroundColor = colorPalette['Background Pressed Color'];
            this._button.style.borderColor = colorPalette['Border Color Pressed'];
            this._button.style.color = colorPalette['Text Color Pressed'];
        });

        // Reset to normal style when mouse leaves or is released
        this._button.addEventListener("mouseleave", () => {
            this._button.style.backgroundColor = this.buttonColor;
            this._button.style.borderColor = colorPalette['Border Color'];
            this._button.style.color = colorPalette['Text Color'];
        });

        this._button.addEventListener("mouseup", () => {
            this._button.style.backgroundColor = this.buttonColor;
            this._button.style.borderColor = colorPalette['Border Color'];
            this._button.style.color = colorPalette['Text Color'];
        });

        // Event listener for button click
        this._button.addEventListener("click", () => {
            this.currentValue = this._context.parameters.ValueSetOnClick.raw || "1";
            this._notifyOutputChanged(); // Notify the framework of the change
        });

        this._container.appendChild(this._button); // Append button to the container

    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this.currentValue = context.parameters.BoundField.raw ?? "";
    }

    public getOutputs(): IOutputs {
        return {
            BoundField: this.currentValue
        };
    }

    public destroy(): void {
        // Cleanup if necessary
    }

    // ====================================================================================

    // Helper functions to convert hex to RGB and vice versa
    private hexToRgb(hex: string): [number, number, number] {
        const trimmedHex = hex.startsWith('#') ? hex.slice(1) : hex;
        const r = parseInt(trimmedHex.substring(0, 2), 16);
        const g = parseInt(trimmedHex.substring(2, 4), 16);
        const b = parseInt(trimmedHex.substring(4, 6), 16);
        return [r, g, b];
    }

    private rgbToHex(rgb: [number, number, number]): string {
        return `#${((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2])
            .toString(16)
            .slice(1)
            .toUpperCase()}`;
    }

    private generateColorPalette(backgroundColor: string): Record<string, string> {
        const [r, g, b] = this.hexToRgb(backgroundColor);
    
        const borderColor: [number, number, number] = [Math.floor(r * 0.8), Math.floor(g * 0.8), Math.floor(b * 0.8)];
        const textColor: [number, number, number] = (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? [0, 0, 0] : [255, 255, 255];
    
        const hoverBackgroundColor: [number, number, number] = [Math.floor(r * 0.9), Math.floor(g * 0.9), Math.floor(b * 0.9)];
    
        return {
            'Background Color': backgroundColor,
            'Border Color': this.rgbToHex(borderColor),
            'Text Color': this.rgbToHex(textColor),
            'Background Hover Color': this.rgbToHex(hoverBackgroundColor),
            'Border Color Hover': this.rgbToHex(borderColor),
            'Text Color Hover': this.rgbToHex(textColor),
            'Background Pressed Color': backgroundColor,
            'Border Color Pressed': this.rgbToHex(borderColor),
            'Text Color Pressed': this.rgbToHex(textColor),
        };
    }
}
