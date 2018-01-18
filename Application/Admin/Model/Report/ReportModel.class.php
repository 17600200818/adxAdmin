<?phpnamespace Admin\Model\Report;use Think\Model;class ReportModel extends Model {    public $requset;    public function setParam($param) {        $this->requset = $param;    }    public function getSql() {        $sqlAry = array();        $field = implode(',', $this->field);        $onlyField = $this->groupBy;        if (!isset($this->requset['page']) || $this->requset['page'] <= 0) {            $this->requset['page'] = 1;        }        $offset = ($this->requset['page'] - 1) * $this->requset['pageSize'];        $table = implode(' union all ', $this->getReportTable($this->dbTablePrefix));        $sql = "select {$onlyField},{$field} from ({$table}) as a group by {$onlyField} order by {$this->orderBy} limit {$offset},{$this->requset['pageSize']}";        $totalSql = "select {$field} from ({$table}) as a";        $totalNumSql = "select count(*) as num from ({$table}) as a group by {$onlyField} ";        $sqlAry['sql'] = $sql;        $sqlAry['totalSql'] = $totalSql;        $sqlAry['totalNumSql'] = $totalNumSql;        return $sqlAry;    }    public function getWhere() {        $where = array();        $reportType = $this->requset['reportType'];        if ($reportType == 'sellerSummary' || $reportType == 'sellerMedia' || $reportType == 'sellerPlace' || $reportType == 'operationSummary' || $reportType == 'operationPlace' || $reportType == 'operationFailure' || $reportType == 'operationPmp') {            if ($this->requset['sellerId'] != '') {                $where[] = "sellerId = {$this->requset['sellerId']}";            }        }        if ($reportType == 'sellerMedia' || $reportType == 'sellerPlace' || $reportType == 'operationPlace' || $reportType == 'operationFailure') {            if ($this->requset['mediaId'] != '') {                $where[] = "mediaId = {$this->requset['mediaId']}";            }        }        if ($reportType == 'sellerPlace' || $reportType == 'operationPlace' || $reportType == 'operationFailure') {            if ($this->requset['placeId'] != '') {                $where[] = "placeId = {$this->requset['placeId']}";            }        }        if ($reportType == 'buyerSummary' || $reportType == 'operationSummary' || $reportType == 'operationPlace' || $reportType == 'operationFailure' || $reportType == 'operationPmp') {            if ($this->requset['buyerId'] != '') {                $where[] = "buyerId = {$this->requset['buyerId']}";            } }        if ($reportType == 'sellerSize'){             if ($this->requset['sellerId'] != '') {                $where[] = "sellerId = {$this->requset['sellerId']}";                           }            if ($this->requset['w'] != '') {                $where[] = "w = {$this->requset['w']}";                           }            if ($this->requset['h'] != '') {                $where[] = "h = {$this->requset['h']}";                           }                    }               $this->whereAry = $where;    }    public function getReportTable($dbTablePrefix) {        $reportAry = explode('-', $this->requset['reportDate']);        $reportAry[0] = $reportAry[0] ? $reportAry[0] : date('Y-m-d', strtotime("-5 day", time()));        $reportAry[1] = $reportAry[1] ? $reportAry[1] : date('Y-m-d');        $reportAry[0] = trim(str_replace('/', '-', $reportAry[0]));        $reportAry[1] = trim(str_replace('/', '-', $reportAry[1]));        $startDate = date('Y_m', strtotime($reportAry[0]));        $endDate = date('Y_m', strtotime($reportAry[1]));        $table = $dbTablePrefix . "_" . $startDate;        $this->getWhere();        $this->whereAry[] = "reportDate>='{$reportAry[0]}'";        $this->whereAry[] = "reportDate<='{$reportAry[1]}'";        $where = implode(' and ', $this->whereAry);        $arrTables = array("select * from {$table} where  1 and {$where}");        while ($startDate != $endDate) {            $startDate = date('Y_m', strtotime("+1 month", strtotime(str_replace('_', '-', $startDate) . "-01")));            $table = $dbTablePrefix . "_" . $startDate;            $arrTables[] = "select * from {$table} where 1 and  $where";        }        return $arrTables;    }}