window.sqlTablesCompleter = {
    target: {
        database: 'log',
        table: 'testdb'
    },
    completerCache: [],
    getCompletions: function (editor, session, pos, prefix, callback) {
        var self = this;
        var key = self.target.database + '.' + self.target.table;
        if (self.completerCache[key]) {
            callback(null, self.completerCache[key]);
            return;
        }

        var sql = '这是请求到后端拿到字段映射关系的sql'//self.buildExploreQuery("COLUMNS");
        self._post(sql, function (response) {
            self.completerCache[key] = response.data.map(function (item) {
                return {
                    caption: item.text,
                    value: item.text,
                    meta: key,
                    docHTML: self._convertToHTML(item),
                };
            });
            callback(null, self.completerCache[key]);
        });
    },
    _convertToHTML: function (item) {
        var desc = item.value, space_index = 0, start = 0, line = "", next_line_end = 60, lines = [];
        for (var i = 0; i < desc.length; i++) {
            if (desc[i] === ' ') {
                space_index = i;
            } else if (i >= next_line_end && space_index !== 0) {
                line = desc.slice(start, space_index);
                lines.push(line);
                start = space_index + 1;
                next_line_end = i + 60;
                space_index = 0;
            }
        }
        line = desc.slice(start);
        lines.push(line);
        return ["<b>", item.text, "</b>", "<hr></hr>", lines.join("&nbsp<br>")].join("");
    },
    _post: function (sql, callback) {
        //这里需要改造成去请求表的schema的数据 
        callback(JSON.parse("{\n" +
            "    \"data\": [\n" +
            "        {\n" +
            "            \"text\": \"field1\",\n" +
            "            \"value\": \"DateTime\"\n" +
            "        },\n" +
            "        {\n" +
            "            \"text\": \"field2\",\n" +
            "            \"value\": \"String\"\n" +
            "        }\n" +
            "    ]\n" +
            "}"));
    }
};

// langTools.addCompleter(sqlTablesCompleter);