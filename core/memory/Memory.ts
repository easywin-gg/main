import { DataType, Module, Process } from "memoryjs";
import memoryjs from "memoryjs";

class Memory {

    public static process: Process;
    public static module: Module;

    public static readMemory(address: number, dataType: DataType): any {
        return memoryjs.readMemory(Memory.process.handle, address, dataType);
    }

    public static readBuffer(address: number, size: number): Buffer {
        return memoryjs.readBuffer(Memory.process.handle, address, size);
    }

    public static readIntegerFromBuffer(buffer: Buffer, offset: number) {
        return buffer.slice(offset, offset + 4).readIntLE(0, 4);
    }
 
    public static readFloatFromBuffer(buffer: Buffer, offset: number) {
        return buffer.slice(offset, offset + 4).readFloatLE(0);
    }

    public static readDoubleFromBuffer(buffer: Buffer, offset: number) {
        return buffer.slice(offset, offset + 4).readDoubleLE(0);
    }
}

export default Memory;