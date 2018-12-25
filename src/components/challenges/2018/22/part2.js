import returnInputText from './input';

export default function Solution22Part02() {
    let lines = returnInputText().split(/\n/g);
    let depth = +lines[0].split(': ')[1];
    let coords = lines[1].split(': ')[1].split(',');
    let targetX = +coords[0];
    let targetY = +coords[1];

    let erosion = [];

    function getErosion(x, y) {
        if(erosion[x] && erosion[x][y]) {
            return erosion[x][y];
        }

        let geoIndex;

        if((x === 0 && y === 0) || (x === targetX && y === targetY)) {
            geoIndex = 0;
        }
        else if(x === 0) {
            geoIndex = y * 48271;
        }
        else if(y === 0) {
            geoIndex = x * 16807;
        }
        else {
            geoIndex = getErosion(x-1, y) * getErosion(x, y - 1);
        }

        let erosionVal = (geoIndex + depth) % 20183;

        erosion[x] = erosion[x] || [];
        erosion[x][y] = erosionVal;

        return erosionVal;
    }

    function getType(x, y) {
        return getErosion(x, y) % 3;
    }

    // rocky = 0, wet = 1, narrow = 2
    // nothing = 0, torch = 1, climbing = 2
    function isToolValid(type, tool) {
        return type !== tool;
    }

    function otherValidTool(type, tool) {
        for(let i = 0; i <= 2; i++) {
            if(i !== type && i !== tool) {
                return i;
            }
        }
    }

    let path = [[{x: 0, y: 0, elapsed: 0, tool: 1, route: []}]];
    let currentElapsed = 0;
    let visited = {};

    main: while(true) {
        while(path[currentElapsed] && path[currentElapsed].length) {
            let current = path[currentElapsed].shift();

            let route = current.route.slice(0);
            route.push({x: current.x, y: current.y, tool: current.tool});

            if(current.x === targetX && current.y === targetY) {
                if(current.tool === 1) {
                    return current.elapsed;
                    break main;
                }
                path[current.elapsed + 7] = path[current.elapsed + 7] || [];
                path[current.elapsed + 7].push({x: current.x, y: current.y, tool: 1, elapsed: current.elapsed + 7, route});
            }
            if(visited[current.x + ',' + current.y + ',' + current.tool]) {
                continue;
            }
            visited[current.x + ',' + current.y + ',' + current.tool] = true;

            let candidates = [{x: current.x, y: current.y + 1}, {x: current.x + 1, y: current.y}, {x: current.x - 1, y: current.y}, {x: current.x, y: current.y - 1}];

            for(let candidate of candidates) {
                let x = candidate.x;
                let y = candidate.y;
                if(x >= 0 && y >= 0) {
                    let targetType = getType(x, y);
                    if(isToolValid(targetType, current.tool)) {
                        path[current.elapsed + 1] = path[current.elapsed + 1] || [];
                        path[current.elapsed + 1].push({x, y, elapsed: current.elapsed + 1, tool: current.tool, route});
                    }
                }
            }
            let currentType = getType(current.x, current.y);
            path[current.elapsed + 7] = path[current.elapsed + 7] || []
            path[current.elapsed + 7].push({x: current.x, y: current.y, elapsed: current.elapsed + 7, tool: otherValidTool(currentType, current.tool), route})
        }
        currentElapsed++;
    }   
}