import os from 'os'

//comment added remotely
export default function getPrivateIPv4Addresses() {
    const interfaces = os.networkInterfaces();
    const privateIPv4Addresses = [];


    for (const interfaceName of Object.keys(interfaces)) {
        if (interfaceName === 'Wi-Fi') {
            for (const interfaceInfo of interfaces[interfaceName]) {
                if (interfaceInfo.family === 'IPv4' && !interfaceInfo.internal) {
                    console.log(interfaceInfo)
                    const ipAddress = interfaceInfo.address;
                    const isPrivateIPv4 = /^(10\.|172\.1[6-9]\.|172\.2[0-9]\.|172\.3[0-1]\.|192\.168\.)/.test(ipAddress);
                    if (isPrivateIPv4) {
                        privateIPv4Addresses.push(ipAddress);
                    }
                }
            }
        }
    }

    return privateIPv4Addresses;
}
