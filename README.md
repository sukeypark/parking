# 구성(index.html)
1. mqtt_stomp 설정(Ln 117 - Ln 143)

2. 데이터 파싱 부분
- Ln 83 - 115 OnSub 함수
- parser.js (human readable) 

3. 화면 구성
- Ln 86) device_id ==> dev_eui 값
- Ln 89) payload ==> HexStr Payload 값
- Ln 90) parsed_payload_info ==> parser.js로부터 파싱된 human readable 값

**주차유무판단은 parsed_payload_info[2] 가 vacant | occupied 인지로 판단 가능**

> payload값이 37 66 00, 15 66 00, 37 66 01, 15 66 01 일 경우 주차유무 판단 가능한 신호이므로 마지막 byte의 값(00(vacant), 01(occupied))를 읽어 판단 가능
>
> 하지만 여러 센서의 값이 연결된 payload값을 수신하는 경우가 있으므로 (예: 15 66 00 02 67 00 F0) 이 방법은 지양하는 편이 좋다.

